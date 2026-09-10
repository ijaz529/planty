/**
 * Route planning for one technician's day.
 *
 * Pure functions, no database. The operator applies the result through
 * `apply_route()` in Postgres, which is where the permission to renumber a day
 * actually lives — this file only decides what order to suggest.
 *
 * Distances are straight lines. Planty has no map data and no routing service,
 * and a straight line ranks orders well enough to beat numbering stops by hand.
 * Everything shown to a human says "as the crow flies" so nobody mistakes it for
 * a satnav's answer. Swapping in a real distance matrix later replaces
 * `haversineMetres` and nothing else.
 */

export type Point = { lat: number; lon: number };

export type Stop = Point & { id: string };

export type RoutePlan = {
  /** The stops that could be routed, in the order to drive them. */
  order: Stop[];
  /** Stops whose site has no coordinates. Reported, never dropped (FR-006). */
  unroutable: string[];
  /** Depot → every stop → depot, in metres. */
  distanceMetres: number;
};

const EARTH_RADIUS_M = 6_371_000;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in metres. Dubai is flat enough that this is fine. */
export function haversineMetres(a: Point, b: Point): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Depot → stops in this order → depot. */
export function routeLength(depot: Point, stops: Point[]): number {
  if (stops.length === 0) return 0;
  let total = haversineMetres(depot, stops[0]);
  for (let i = 1; i < stops.length; i++) {
    total += haversineMetres(stops[i - 1], stops[i]);
  }
  return total + haversineMetres(stops[stops.length - 1], depot);
}

/** Repeatedly drive to whichever stop is closest to where you are. */
function nearestNeighbour(depot: Point, stops: Stop[]): Stop[] {
  const remaining = [...stops];
  const order: Stop[] = [];
  let here: Point = depot;
  while (remaining.length > 0) {
    let best = 0;
    let bestDistance = haversineMetres(here, remaining[0]);
    for (let i = 1; i < remaining.length; i++) {
      const d = haversineMetres(here, remaining[i]);
      if (d < bestDistance) {
        best = i;
        bestDistance = d;
      }
    }
    here = remaining[best];
    order.push(remaining.splice(best, 1)[0]);
  }
  return order;
}

/**
 * Un-cross the route: repeatedly reverse any run of stops that shortens it.
 *
 * Nearest-neighbour paints itself into corners — it takes the cheap stop early
 * and pays for it with a long drive home. Reversing a segment fixes exactly
 * that, and since a reversal is only kept when it shortens the route, this can
 * never make the answer worse (FR-004).
 */
function twoOpt(depot: Point, order: Stop[]): Stop[] {
  if (order.length < 3) return order;
  let best = [...order];
  let bestLength = routeLength(depot, best);
  let improved = true;
  // Bounded so a pathological set cannot spin: each pass is O(n^2) and n is a
  // day's stops, not a warehouse's.
  let passes = 0;
  while (improved && passes < 20) {
    improved = false;
    passes += 1;
    for (let i = 0; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const candidate = [
          ...best.slice(0, i),
          ...best.slice(i, k + 1).reverse(),
          ...best.slice(k + 1),
        ];
        const length = routeLength(depot, candidate);
        if (length < bestLength - 0.5) {
          best = candidate;
          bestLength = length;
          improved = true;
        }
      }
    }
  }
  return best;
}

/**
 * Suggest an order for a day's stops.
 *
 * Stops without coordinates cannot be placed, so they come back separately for
 * the caller to show and to put at the end of the day.
 */
export function planRoute(
  depot: Point,
  stops: { id: string; lat: number | null; lon: number | null }[]
): RoutePlan {
  const routable: Stop[] = [];
  const unroutable: string[] = [];
  for (const s of stops) {
    if (typeof s.lat === "number" && typeof s.lon === "number") {
      routable.push({ id: s.id, lat: s.lat, lon: s.lon });
    } else {
      unroutable.push(s.id);
    }
  }

  // Improve two starting points and keep the better.
  //
  // Nearest-neighbour is usually the stronger start, but not always: it can
  // paint itself into a corner worse than the order the stops arrived in, and
  // two-opt only ever improves on the start it is given, so it cannot rescue a
  // bad one. Improving the incoming order too makes FR-004 true by
  // construction — the answer is never longer than what it replaces, because
  // one of the candidates began there.
  const fromNearest = twoOpt(depot, nearestNeighbour(depot, routable));
  const fromGiven = twoOpt(depot, routable);
  const order =
    routeLength(depot, fromNearest) <= routeLength(depot, fromGiven)
      ? fromNearest
      : fromGiven;

  return { order, unroutable, distanceMetres: routeLength(depot, order) };
}

/** "12.4 km as the crow flies" — never a figure a satnav would recognise. */
export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m as the crow flies`;
  return `${(metres / 1000).toFixed(1)} km as the crow flies`;
}

/** "saves 3.1 km" — or nothing at all, when it does not. */
export function savingPhrase(beforeMetres: number, afterMetres: number): string | null {
  const saved = beforeMetres - afterMetres;
  if (saved < 100) return null;
  return saved < 1000
    ? `saves about ${Math.round(saved)} m`
    : `saves about ${(saved / 1000).toFixed(1)} km`;
}

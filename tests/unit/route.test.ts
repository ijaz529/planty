import { describe, expect, it } from "vitest";
import {
  formatDistance,
  haversineMetres,
  planRoute,
  routeLength,
  savingPhrase,
} from "../../src/lib/route";

/** Al Quoz, roughly. The depot a technician starts and finishes at. */
const DEPOT = { lat: 25.135, lon: 55.23 };

describe("haversineMetres", () => {
  it("is zero between a point and itself", () => {
    expect(haversineMetres(DEPOT, DEPOT)).toBe(0);
  });

  it("is symmetric", () => {
    const a = { lat: 25.2, lon: 55.27 };
    const b = { lat: 25.08, lon: 55.14 };
    expect(haversineMetres(a, b)).toBeCloseTo(haversineMetres(b, a), 6);
  });

  it("measures a known Dubai distance to within a few percent", () => {
    // Business Bay to Dubai Marina is about 18 km in a straight line.
    const businessBay = { lat: 25.187, lon: 55.27 };
    const marina = { lat: 25.079, lon: 55.142 };
    const km = haversineMetres(businessBay, marina) / 1000;
    expect(km).toBeGreaterThan(16);
    expect(km).toBeLessThan(20);
  });

  it("does not return NaN for antipodal-ish points", () => {
    expect(haversineMetres({ lat: 0, lon: 0 }, { lat: 0, lon: 180 })).toBeGreaterThan(0);
  });
});

describe("planRoute", () => {
  it("says nothing rather than failing on an empty day", () => {
    const plan = planRoute(DEPOT, []);
    expect(plan.order).toEqual([]);
    expect(plan.distanceMetres).toBe(0);
    expect(plan.unroutable).toEqual([]);
  });

  it("routes a single stop out and back", () => {
    const stop = { id: "a", lat: 25.2, lon: 55.27 };
    const plan = planRoute(DEPOT, [stop]);
    expect(plan.order.map((s) => s.id)).toEqual(["a"]);
    expect(plan.distanceMetres).toBeCloseTo(haversineMetres(DEPOT, stop) * 2, 6);
  });

  it("finds the obvious order when the stops sit on a line", () => {
    // Four stops due north of the depot. The only sensible order is outward
    // then home; any other crosses its own path.
    const stops = [
      { id: "far", lat: 25.4, lon: 55.23 },
      { id: "near", lat: 25.2, lon: 55.23 },
      { id: "furthest", lat: 25.5, lon: 55.23 },
      { id: "mid", lat: 25.3, lon: 55.23 },
    ];
    const plan = planRoute(DEPOT, stops);
    expect(plan.order.map((s) => s.id)).toEqual(["near", "mid", "far", "furthest"]);
  });

  it("reports a stop with no coordinates instead of dropping it (FR-006)", () => {
    const plan = planRoute(DEPOT, [
      { id: "known", lat: 25.2, lon: 55.27 },
      { id: "no-pin", lat: null, lon: null },
    ]);
    expect(plan.order.map((s) => s.id)).toEqual(["known"]);
    expect(plan.unroutable).toEqual(["no-pin"]);
  });

  it("keeps every stop, routable or not (SC-005)", () => {
    const stops = [
      { id: "a", lat: 25.2, lon: 55.27 },
      { id: "b", lat: null, lon: 55.2 },
      { id: "c", lat: 25.1, lon: null },
      { id: "d", lat: 25.05, lon: 55.15 },
    ];
    const plan = planRoute(DEPOT, stops);
    expect([...plan.order.map((s) => s.id), ...plan.unroutable].sort()).toEqual([
      "a", "b", "c", "d",
    ]);
  });

  it("handles two sites at the same address", () => {
    const here = { lat: 25.2, lon: 55.27 };
    const plan = planRoute(DEPOT, [
      { id: "a", ...here },
      { id: "b", ...here },
    ]);
    expect(plan.order).toHaveLength(2);
    expect(plan.distanceMetres).toBeCloseTo(haversineMetres(DEPOT, here) * 2, 6);
  });
});

describe("the suggestion is never worse than the order it replaces (FR-004, SC-002)", () => {
  /** Deterministic pseudo-random, so a failure can be reproduced exactly. */
  function makeRng(seed: number) {
    let s = seed;
    return () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  }

  it("holds across 200 random days around Dubai", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const rnd = makeRng(seed);
      const count = 2 + Math.floor(rnd() * 12);
      const stops = Array.from({ length: count }, (_, i) => ({
        id: `s${i}`,
        lat: 25.0 + rnd() * 0.4,
        lon: 55.1 + rnd() * 0.4,
      }));

      const before = routeLength(DEPOT, stops);
      const plan = planRoute(DEPOT, stops);
      const after = plan.distanceMetres;

      expect(plan.order).toHaveLength(count);
      // Half a metre of slack for floating point, matching the improvement
      // threshold inside twoOpt.
      expect(after).toBeLessThanOrEqual(before + 0.5);
    }
  });

  it("actually shortens a deliberately terrible order", () => {
    // A zig-zag: alternating far north and far south, which is about the worst
    // order these six stops can be driven in.
    const stops = [
      { id: "n1", lat: 25.4, lon: 55.2 },
      { id: "s1", lat: 25.0, lon: 55.2 },
      { id: "n2", lat: 25.4, lon: 55.3 },
      { id: "s2", lat: 25.0, lon: 55.3 },
      { id: "n3", lat: 25.4, lon: 55.4 },
      { id: "s3", lat: 25.0, lon: 55.4 },
    ];
    const before = routeLength(DEPOT, stops);
    const after = planRoute(DEPOT, stops).distanceMetres;
    expect(after).toBeLessThan(before * 0.75);
  });
});

describe("saying it in words", () => {
  it("never implies a satnav's answer", () => {
    expect(formatDistance(450)).toBe("450 m as the crow flies");
    expect(formatDistance(12_430)).toBe("12.4 km as the crow flies");
  });

  it("stays quiet when the saving is not worth mentioning", () => {
    expect(savingPhrase(10_000, 9_950)).toBeNull();
    expect(savingPhrase(10_000, 10_000)).toBeNull();
  });

  it("names a saving worth having", () => {
    expect(savingPhrase(10_000, 6_900)).toBe("saves about 3.1 km");
    expect(savingPhrase(1_000, 700)).toBe("saves about 300 m");
  });
});

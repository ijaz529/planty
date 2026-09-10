"use client";

import { useState } from "react";

/**
 * Catalog images live in the public `catalog` storage bucket. If an object is
 * missing — a fresh database before `npm run seed:images`, or a photo deleted
 * in production — we degrade to a tinted panel with the plant's initial rather
 * than showing a broken image.
 */
export function PlantPhoto({
  path,
  name,
  className = "",
}: {
  path: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const src =
    path && base
      ? `${base}/storage/v1/object/public/catalog/${path}`
      : null;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-leaf-soft ${className}`}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span aria-hidden className="text-4xl font-semibold text-leaf/30">
          {name.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

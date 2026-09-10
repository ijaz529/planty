import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Planty",
    short_name: "Planty",
    description: "Rent plants. We keep them alive.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#2f6b46",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Massafra MX Park",
    short_name: "Massafra MX",
    description: "Motocross, enduro e minicross a Ginosa (TA)",
    start_url: "/it",
    display: "browser",
    background_color: "#0B0B0D",
    theme_color: "#0B0B0D",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}

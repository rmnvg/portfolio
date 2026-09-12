import type { MetadataRoute } from "next";
import { personal } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personal.name} — ${personal.role}`,
    short_name: personal.name,
    description: personal.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#14110d",
    theme_color: "#14110d",
  };
}

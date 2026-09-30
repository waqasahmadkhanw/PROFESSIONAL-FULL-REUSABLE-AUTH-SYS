import type { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: env.APP_NAME,
    short_name: env.APP_NAME,
    description: env.APP_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "en",
    categories: ["business", "productivity"],
  };
}

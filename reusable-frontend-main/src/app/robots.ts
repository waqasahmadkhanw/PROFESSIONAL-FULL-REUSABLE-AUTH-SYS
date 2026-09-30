import type { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: ["/admin", "/profile", "/login", "/register", "/forgot-password", "/reset-password"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,

    host: baseUrl,
  };
}
import type { MetadataRoute } from "next";
import { origin, isPublished } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isPublished ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}

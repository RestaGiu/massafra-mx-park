import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["it", "en"].map((locale) => ({
    url: `${origin}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages: { it: `${origin}/it`, en: `${origin}/en` } },
  }));
}

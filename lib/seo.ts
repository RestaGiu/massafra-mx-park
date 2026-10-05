import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { withBasePath } from "@/lib/paths";
export const origin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
export const isPublished = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
export function metadata(locale: Locale, path = "", title?: string): Metadata {
  const description =
    locale === "it"
      ? "Pista motocross in Puglia, fettucciato enduro e minicross a Ginosa (TA). Noleggio moto cross, gare UISP e prenotazioni al Massafra MX Park."
      : "Motocross, enduro and minicross in Ginosa, Puglia. Rent a dirt bike, follow UISP races and book your next ride at Massafra MX Park.";
  const pageTitle =
    title ||
    (locale === "it"
      ? "Massafra MX Park | Motocross e noleggio moto a Ginosa"
      : "Massafra MX Park | Motocross & bike rental in Ginosa");
  return {
    metadataBase: new URL(origin),
    title: pageTitle,
    description,
    alternates: {
      canonical: `${origin}/${locale}${path}`,
      languages: {
        it: `${origin}/it${path}`,
        en: `${origin}/en${path}`,
        "x-default": `${origin}/it${path}`,
      },
    },
    robots: { index: isPublished, follow: isPublished },
    openGraph: {
      title: pageTitle,
      description,
      url: `${origin}/${locale}${path}`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_GB",
      alternateLocale: locale === "it" ? "en_GB" : "it_IT",
      siteName: "Massafra MX Park",
      images: [
        {
          url: `${origin}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Massafra MX Park · Ginosa, Puglia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [`${origin}/opengraph-image`],
    },
    icons: {
      icon: withBasePath("/icon.svg"),
      apple: withBasePath("/icon.svg"),
    },
    manifest: withBasePath("/manifest.webmanifest"),
  };
}

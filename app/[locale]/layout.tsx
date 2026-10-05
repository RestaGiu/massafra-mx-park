import { Anton, Barlow, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { origin } from "@/lib/seo";
import "../globals.css";

export const metadata = { metadataBase: new URL(origin) };

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});
const mono = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      className={`${anton.variable} ${barlow.variable} ${mono.variable}`}
    >
      <body className={site.effects.grain ? "has-grain" : ""}>
        <NextIntlClientProvider messages={null}>
          <a className="skip-link" href="#main">
            {copy[locale].nav.skip}
          </a>
          <div id="top-sentinel" />
          <Header locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

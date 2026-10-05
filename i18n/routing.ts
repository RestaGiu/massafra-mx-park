import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  localePrefix: "always",
  localeCookie: { name: "NEXT_LOCALE", maxAge: 31536000 },
});
export type Locale = "it" | "en";

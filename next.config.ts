import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};
export default createNextIntlPlugin("./i18n/request.ts")(config);

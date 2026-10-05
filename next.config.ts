import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";
const staticExport = Boolean(basePath);

const config: NextConfig = {
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: staticExport,
  },
};
export default createNextIntlPlugin("./i18n/request.ts")(config);

/** @type {import('next').NextConfig} */
import { SUPPORTED_LANGS, DEFAULT_LANG } from "./src/config/index.js";

const wpHostname = new URL(process.env.NEXT_PUBLIC_WP_BASE).hostname;
const nonDefaultLangs = SUPPORTED_LANGS.filter((l) => l !== DEFAULT_LANG);

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHostname, pathname: "/**" },
      { protocol: "https", hostname: `www.${wpHostname}`, pathname: "/**" },
    ], 
  },

  async redirects() {
    return SUPPORTED_LANGS.map((lang) => ({
      source: lang === DEFAULT_LANG ? "/frontpage" : `/${lang}/frontpage`,
      destination: lang === DEFAULT_LANG ? "/" : `/${lang}`,
      permanent: true,
    }));
  },

  async rewrites() {
    return [
      // Pass-throughs for each non-default language (prevents catch-all rewrite below from grabbing them)
      ...nonDefaultLangs.flatMap((lang) => [
        { source: `/${lang}`, destination: `/${lang}` },
        { source: `/${lang}/:path*`, destination: `/${lang}/:path*` },
      ]),
      // Default language: rewrite everything else to /en/...
      { source: "/", destination: `/${DEFAULT_LANG}` },
      { source: "/:path*", destination: `/${DEFAULT_LANG}/:path*` },
    ];
  },
};

export default nextConfig;

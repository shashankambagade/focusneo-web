// src/app/robots.js

const SITE_URL = process.env.SITE_URL || "https://www.focusneo.eu";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

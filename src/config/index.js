// src/config/index.js

export const DEFAULT_LANG = process.env.DEFAULT_LANG || "en";
export const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE;

// ─── Add new languages here — everything else updates automatically ───────────
export const SUPPORTED_LANGS = ["en", "sv", "no", "fi"];
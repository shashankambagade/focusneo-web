// src/config/index.js

export const DEFAULT_LANG = "en";
export const WP_BASE = "https://gomowebb.com/focusneo/wp-json";

// All supported language codes
export const SUPPORTED_LANGS = ["en", "fi", "no", "sv"];

// Maps lang code → HTML/OG locale string
export const LANG_LOCALE_MAP = {
  en: "en_US",
  fi: "fi_FI",
  no: "nb_NO",
  sv: "sv_SE",
};

// Display labels for the language switcher UI
export const LANG_LABELS = {
  en: "EN",
  fi: "FI",
  no: "NO",
  sv: "SV",
};

// Homepage URL per language (English has no prefix)
export const LANG_HOME = {
  en: "/",
  fi: "/fi",
  no: "/no",
  sv: "/sv",
};

// Prepends the correct language prefix to internal URLs.
// External URLs (not starting with "/") are returned unchanged.
export function langUrl(url, lang) {
  if (!url || !url.startsWith("/")) return url || "#";
  return lang === "en" ? url : `/${lang}${url}`;
}
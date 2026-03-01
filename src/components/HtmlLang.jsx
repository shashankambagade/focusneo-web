"use client";

import { useEffect } from "react";

// Updates <html lang=""> on the client to match the current language.
// Needed because root layout can't dynamically receive [lang] params.
export default function HtmlLang({ lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

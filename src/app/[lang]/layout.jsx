// src/app/[lang]/layout.jsx

import HtmlLang from "@/components/HtmlLang";

export const dynamicParams = true;

export default async function LangLayout({ children, params }) {
  const { lang } = await params;

  return (
    <>
      <HtmlLang lang={lang} />
      {children}
    </>
  );
}

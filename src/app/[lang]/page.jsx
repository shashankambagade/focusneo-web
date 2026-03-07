//src/app/[lang]/page.jsx

import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import { getPageBySlug } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { resolveParams } from "@/lib/params";
import { notFound } from "next/navigation";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "@/config";

export const revalidate = 60;

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function LangHomePage({ params }) {
  const resolvedParams = resolveParams(await params);
  const lang = resolvedParams.lang || DEFAULT_LANG;
  const page = await getPageBySlug("frontpage", lang);

  if (!page) notFound();

  return (
    <>
      <Header lang={lang} entryType="pages" entryId={page?.id} />
      <main id="home">
        <PageBuilder sections={page?.acf?.page_builder} lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = resolveParams(await params);
  const page = await getPageBySlug("frontpage", resolvedParams.lang);
  return buildMetadataFromYoast(page, { lang: resolvedParams.lang });
}

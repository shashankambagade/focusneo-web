// src/components/major/Footer.jsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getFooterWidgets, getThemeOptions } from "@/lib/api";
import { DEFAULT_LANG, langUrl } from "@/config";

import LinkedInPng from "../../../public/linkedin.png";
import XPng from "../../../public/x.png";
import ArrowSvgB from "../../../public/right-arrow-black.png";
import RightSVG from "../../../public/right-arrow.svg";

// Map icons
const SOCIAL_ICON_MAP = {
  linkedin: LinkedInPng,
  x: XPng,
};

// Helpers
function stripHtml(text = "") {
  return text
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinksFromHtml(html) {
  if (!html) return [];
  const matches = Array.from(
    html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim)
  );

  return matches
    .map((m) => ({
      href: m[1] || "#",
      label: stripHtml(m[2]) || "Link",
    }))
    .filter((item) => item.label);
}

function extractOfficesFromHtml(html) {
  if (!html) return [];
  const normalized = html.replace(/\\n/g, "");
  const blocks = [];
  const regex = /<strong>(.*?)<\/strong>([\s\S]*?)(?=<strong>|$)/gi;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    const title = stripHtml(match[1]);
    const lines = match[2]
      .split(/<br\s*\/?>/i)
      .map((line) => line.trim())
      .filter(Boolean);

    if (title) blocks.push({ title, lines });
  }

  return blocks;
}

export default async function Footer({ lang = DEFAULT_LANG }) {
  // Fetch WP theme options + footer widgets
  let [widgets, themeOptions] = await Promise.all([
    getFooterWidgets(lang),
    getThemeOptions(lang),
  ]);

  // WordPress doesn't have footer widgets/options configured for non-English yet.
  // Fall back to English so the footer still renders correctly.
  if (lang !== DEFAULT_LANG) {
    const needsWidgetsFallback = !widgets?.quick_links && !widgets?.services;
    const needsOptionsFallback = !themeOptions?.footer?.footer_logo?.url;

    if (needsWidgetsFallback || needsOptionsFallback) {
      const [enWidgets, enOptions] = await Promise.all([
        needsWidgetsFallback ? getFooterWidgets(DEFAULT_LANG) : Promise.resolve(widgets),
        needsOptionsFallback ? getThemeOptions(DEFAULT_LANG) : Promise.resolve(themeOptions),
      ]);
      if (needsWidgetsFallback) widgets = enWidgets;
      if (needsOptionsFallback) themeOptions = enOptions;
    }
  }

  // ================================
  //   GET IN TOUCH SECTION DATA
  // ================================
  const contactBlock = themeOptions?.get_in_touch || {};
  const {
    sub_heading,
    heading,
    short_description,
    cta_text,
    cta_url,
    column_i_text,
    column_ii_text,
    column_iii_text,
    column_i_image,
    column_ii_image,
    column_iii_image,
    right_top,
    right_bottom,
  } = contactBlock;

  // FOOTER DATA
  const quickLinks = extractLinksFromHtml(widgets?.quick_links);
  const services = extractLinksFromHtml(widgets?.services);
  const offices = extractOfficesFromHtml(widgets?.offices);

  const servicesTitle = widgets?.services_title || "Services";
  const officesTitle = widgets?.offices_title || "Offices";

  const footerLogo = themeOptions?.footer?.footer_logo;
  const copyrightText = themeOptions?.footer?.copyrights_text;

  // Social links
  const socialLinks = [];
  if (themeOptions?.social?.linkedin) {
    socialLinks.push(["linkedin", themeOptions.social.linkedin]);
  }
  if (themeOptions?.social?.x) {
    socialLinks.push(["x", themeOptions.social.x]);
  }

  const hasMainContent = quickLinks.length > 0 || services.length > 0 || offices.length > 0;
  const hasBottomRow = footerLogo || copyrightText || socialLinks.length > 0;

  return (
    <>


      {/* =====================================================
          EXISTING FOOTER SECTION
         ===================================================== */}
      <footer className="bg-[var(--color-brand)] text-white relative z-10  border-solid border-t border-[#9293a066]">
        <div className="mx-auto w-full web-width px-6 pb-12 pt-12 md:pt-25">
          {/* ============ MAIN FOOTER CONTENT ============ */}
          {hasMainContent && (
            <div className="grid md:grid-cols-2 gap-12 pb-12">
              {/* QUICK LINKS */}
              {quickLinks.length > 0 && (
                <div>
                  <ul className="space-y-4 pb-4 max-w-96">
                    {quickLinks.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center relative group justify-between text-xl md:text-[32px] border-b border-white/10 mb-0 py-[10.5px] [&:nth-child(1)]:pt-0 footer-quick-link"
                      >
                        <Link href={langUrl(item.href, lang)} className=" hover:text-white/70">
                          {item.label}
                          <Image src={RightSVG} width={19} height={19} alt="arrow" className="opacity-0 group-hover:opacity-100 absolute right-3 top-6 " />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SERVICES + OFFICES */}
              {(services.length > 0 || offices.length > 0) && (
                <div className="grid grid-cols-2 gap-10">
                  {/* SERVICES */}
                  {services.length > 0 && (
                    <div>
                      <p className="mb-6 text-[14px] font-[500] uppercase tracking-[0.17px] text-[#9192A0]">
                        {servicesTitle}
                      </p>
                      <ul className="space-y-2 text-base font-normal text-white/90 leading-[30px]">
                        {services.map((service) => (
                          <li key={service.label}>
                            <Link href={langUrl(service.href, lang)} className="hover:text-white/70">
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* OFFICES */}
                  {offices.length > 0 && (
                    <div>
                      <p className="mb-6 text-[14px] font-medium uppercase tracking-[0.17px] text-[#9192A0]">
                        {officesTitle}
                      </p>
                      <div className="space-y-6 text-[16px]">
                        {offices.map((office) => (
                          <div key={office.title}>
                            <p className="mb-3 font-medium uppercase">
                              {office.title}
                            </p>
                            <ul className="space-y-1 text-white">
                              {office.lines.map((line, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: line }} />
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============ BOTTOM ROW ============ */}
          {hasBottomRow && (
            <div className="grid md:grid-cols-2 items-center gap-10 mt-6">
              {/* LOGO */}
              <div>
                {footerLogo?.url && (
                  <div className="relative h-[39px] w-60 opacity-80">
                    <Image
                      src={footerLogo.url}
                      alt="Footer Logo"
                      width={240}
                      height={39}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* COPYRIGHT + SOCIAL */}
              <div className="flex justify-between items-center copyright-social-gap">
                {copyrightText && (
                  <p className="text-[#9192A0]" dangerouslySetInnerHTML={{ __html: copyrightText }} />
                )}

                {/* SOCIAL */}
                <div className="flex gap-3">
                  {socialLinks.map(([network, url]) => {
                    const IconSrc = SOCIAL_ICON_MAP[network];
                    return (
                      <Link key={network} href={url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={IconSrc}
                          width={31}
                          height={31}
                          alt={network}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}

// src/components/major/Header.jsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowSvg from "../../../public/right-arrow.svg";
import DownSvg from "../../../public/down-arrow.svg";
import ArrowSvgB from "../../../public/right-arrow-black.png";
import { getMenu, getThemeOptions, getEntryTranslations } from "@/lib/api";
import { DEFAULT_LANG, SUPPORTED_LANGS, LANG_LABELS, LANG_HOME, langUrl } from "@/config";

// URL path prefix per entry type
const ENTRY_PATH = {
  pages: "",
  page: "",
  services: "/service",
  service: "/service",
  case_study: "/case-study",
  post: "/post",
  posts: "/post",
};

export default function Header({
  lang = DEFAULT_LANG,
  entryType = "pages",
  entryId = null,
}) {
  const [menu, setMenu] = useState(null);
  const [options, setOptions] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  // Maps lang code → translated URL for the current page. Defaults to homepages.
  const [translatedUrls, setTranslatedUrls] = useState(
    Object.fromEntries(SUPPORTED_LANGS.filter((l) => l !== lang).map((l) => [l, LANG_HOME[l]]))
  );
  const langRef = useRef(null);

  const isLoading = !menu;

  // Fetch menu + theme options client-side
  useEffect(() => {
    async function loadData() {
      try {
        let [menuData, themeOptions] = await Promise.all([
          getMenu(lang),
          getThemeOptions(lang),
        ]);

        // WordPress doesn't have menus/options configured for non-English languages yet.
        // Fall back to English data so the header still renders correctly.
        if (lang !== DEFAULT_LANG) {
          const needsMenuFallback = !menuData?.main?.length;
          const needsOptionsFallback = !themeOptions?.header?.logo_light?.url;

          if (needsMenuFallback || needsOptionsFallback) {
            const [enMenu, enOptions] = await Promise.all([
              needsMenuFallback ? getMenu(DEFAULT_LANG) : Promise.resolve(menuData),
              needsOptionsFallback ? getThemeOptions(DEFAULT_LANG) : Promise.resolve(themeOptions),
            ]);
            if (needsMenuFallback) menuData = enMenu;
            if (needsOptionsFallback) themeOptions = enOptions;
          }
        }

        setMenu(menuData || { main: [], footer_quick_link: [], services: [] });
        setOptions(themeOptions?.header || {});
      } catch (error) {
        console.error("Failed to load header data:", error);
        setMenu({ main: [], footer_quick_link: [], services: [] });
        setOptions({});
      }
    }
    loadData();
  }, [lang]);

  // Fetch translated URLs for the current page (used by language switcher)
  useEffect(() => {
    if (!entryId) return;

    async function fetchTranslations() {
      try {
        const translations = await getEntryTranslations(entryId, entryType, lang);
        // translations shape: { fi: { slug, id, lang }, no: { slug, ... }, ... }
        if (!translations || translations.code) return;

        const pathPrefix = ENTRY_PATH[entryType] ?? "";
        const urls = {};

        for (const targetLang of SUPPORTED_LANGS.filter((l) => l !== lang)) {
          const t = translations[targetLang];
          if (t?.slug) {
            urls[targetLang] = langUrl(`${pathPrefix}/${t.slug}`, targetLang);
          }
        }

        if (Object.keys(urls).length > 0) {
          setTranslatedUrls((prev) => ({ ...prev, ...urls }));
        }
      } catch {
        // keep the homepage fallback already set in initial state
      }
    }

    fetchTranslations();
  }, [entryId, entryType, lang]);

  // Scroll listener for sticky animation
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerClasses = scrolled
    ? "fixed top-0 w-full z-50 text-white transition-all duration-300 py-4 backdrop-blur-[30px] bg-black/35 shadow-md"
    : "fixed top-0 w-full z-50 text-white transition-all duration-300 bg-transparent py-8";

  // All other languages for the switcher dropdown
  const otherLangs = SUPPORTED_LANGS.filter((l) => l !== lang);

  return (
    <header className={headerClasses}>
      <div className="web-width mx-auto px-6 flex items-center justify-between relative">
        {/* LOGO */}
        <Link
          href={lang === "en" ? "/" : `/${lang}`}
          className="flex relative h-[32px] w-[100px] md:h-[40px] md:w-[100px]"
        >
          {options?.logo_light?.url && (
            <Image
              src={options.logo_light.url}
              alt="FocusNeo Logo"
              width={100}
              height={16}
              className="object-contain"
              priority
            />
          )}
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-4 ">
          {/* Centered glass menu wrapper */}
          <div
            className="
              backdrop-blur-[16px] bg-white/25
              px-8 py-4 rounded-full border border-[#FFFFFF33]
              flex items-center gap-8 lg:absolute lg:left-[338px]
            "
          >
            <ul className="flex items-center gap-9 relative">
              {isLoading ? (
                // SKELETON MENU
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li
                      key={"sk-" + i}
                      className="w-[80px] h-[18px] rounded-full bg-white/30 animate-pulse"
                    />
                  ))}
                </>
              ) : (
                // REAL MENU
                menu?.main?.map((item) => (
                  <li key={item.id} className="relative group">
                    <Link
                      href={langUrl(item.url, lang)}
                      className="
                            text-white/90 text-[15px]
                            hover:text-white transition leading-[18px] flex items-center gap-2"
                    >
                      {item.title}

                      {item.children?.length > 0 && (
                        <span className="transition-transform duration-300 group-hover:rotate-180">
                          <Image
                            src={DownSvg}
                            alt="arrow"
                            width={10}
                            height={10}
                          />
                        </span>
                      )}
                    </Link>

                    {/* SUBMENU */}
                    {item.children?.length > 0 && (
                      <ul
                        className="
                            absolute left-1/2 top-[0px] mt-1
                            -translate-x-1/2 min-w-[180px]
                            pt-8
                            opacity-0 pointer-events-none
                            group-hover:opacity-100 group-hover:pointer-events-auto
                            transition-all duration-300
                            z-[-9]
                          "
                      >
                        {item.children.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={langUrl(sub.url, lang)}
                              className="backdrop-blur-[16px] bg-black/25 py-2
                                    block px-4 py-3 text-white/90 text-sm
                                    hover:text-white transition
                                  "
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer
      text-white/70 hover:text-white text-sm leading-[14px]
      backdrop-blur-xl bg-white/20 px-4 py-4 rounded-sm
      border border-[#FFFFFF33] transition"
            >
              <span>{LANG_LABELS[lang] || lang.toUpperCase()}</span>
              <span
                className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
              >
                <Image src={DownSvg} alt="arrow" width={10} height={10} />
              </span>
            </button>

            {/* Dropdown — all other languages */}
            {langOpen && (
              <div className="absolute right-0 mt-2 min-w-full rounded-sm border border-[#FFFFFF33] shadow-lg overflow-hidden z-50">
                {otherLangs.map((l) => (
                  <Link
                    key={l}
                    href={translatedUrls[l] || LANG_HOME[l]}
                    onClick={() => setLangOpen(false)}
                    className="block px-4 py-3 text-sm text-white/80 backdrop-blur-lg bg-black/25 hover:text-white transition"
                  >
                    {LANG_LABELS[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA BUTTON */}
          {!options?.button_text || !options?.button_url ? (
            <div className="w-[135px] h-[42px] rounded-sm bg-white/20 animate-pulse"></div>
          ) : (
            <Link
              href={langUrl(options.button_url, lang)}
              className="gap-3 group relative inline-flex items-center select-none
                    rounded-sm px-6 py-4 text-white
                    transition-all duration-300
                    w-[150px] overflow-hidden
                    bg-(--color-brand)"
            >
              <span className="relative w-6 flex items-center justify-center">
                <span
                  className="
                        absolute h-2 w-2 rounded-full bg-(--color-accent)
                        transition-all duration-300 ease-out
                        group-hover:opacity-0 group-hover:-translate-x-1"
                ></span>
              </span>

              <span
                className="
                      flex-1 text-[16px] leading-none text-white
                      transition-all duration-300 ease-out
                      group-hover:-translate-x-4
                      whitespace-nowrap"
              >
                {options.button_text}
              </span>

              <span className="relative w-4 flex items-center justify-center">
                <span
                  className="
                        w-4 absolute
                        opacity-0 -translate-x-4
                        transition-all duration-300 ease-out
                        group-hover:opacity-100 group-hover:-translate-x-2
                      "
                >
                  <Image src={ArrowSvg} alt="arrow" width={13} height={13} />
                </span>
              </span>
            </Link>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-white text-3xl"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>

        {/* MOBILE SLIDE-IN MENU */}
        {mobileOpen && (
          <div className="fixed h-[100vh] inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden">
            <div className="absolute right-0 top-0 h-full w-72 bg-[var(--color-brand)] shadow-xl flex flex-col">
              {/* HEADER */}
              <div className="p-6 flex items-center justify-between">
                <span className="text-white font-semibold">Menu</span>
                <button
                  className="text-white text-3xl"
                  onClick={() => {
                    setMobileOpen(false);
                    setOpenSubmenu(null);
                  }}
                >
                  ✕
                </button>
              </div>

              {/* CONTENT (SLIDING PANELS) */}
              <div className="relative flex-1 overflow-hidden px-6">
                {/* MAIN MENU PANEL */}
                <div
                  className={`absolute inset-0 flex flex-col gap-5 transition-transform duration-300 ${
                    openSubmenu ? "-translate-x-full" : "translate-x-0"
                  }`}
                >
                  {menu?.main?.map((item) => {
                    const hasChildren = item.children?.length > 0;
                    return (
                      <div key={item.id} className="flex items-center justify-between">
                        <Link
                          href={langUrl(item.url, lang)}
                          className="text-white text-lg px-6"
                          onClick={() => {
                            setMobileOpen(false);
                            setOpenSubmenu(null);
                          }}
                        >
                          {item.title}
                        </Link>

                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() => setOpenSubmenu(item.id)}
                            className="mr-6"
                          >
                            <Image
                              src={DownSvg}
                              alt="arrow"
                              width={16}
                              height={16}
                              className="-rotate-90"
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* SUBMENU PANEL */}
                {menu?.main?.map((item) => {
                  if (openSubmenu !== item.id) return null;

                  return (
                    <div
                      key={`submenu-${item.id}`}
                      className="absolute inset-0 flex flex-col gap-5 transition-transform duration-300 translate-x-0 px-6"
                    >
                      {/* Back */}
                      <button
                        className="text-white/80 text-sm flex items-center gap-2"
                        onClick={() => setOpenSubmenu(null)}
                      >
                        <Image
                          src={DownSvg}
                          alt="arrow"
                          width={16}
                          height={16}
                          className="rotate-90"
                        />{" "}
                        Back
                      </button>

                      {/* Parent title */}
                      <Link
                        href={langUrl(item.url, lang)}
                        className="text-white text-lg font-semibold"
                        onClick={() => {
                          setMobileOpen(false);
                          setOpenSubmenu(null);
                        }}
                      >
                        {item.title}
                      </Link>

                      {/* Children */}
                      <div className="mt-2 flex flex-col gap-4">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={langUrl(sub.url, lang)}
                            className="text-white/80 text-base hover:text-white transition"
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenSubmenu(null);
                            }}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER (STATIC) */}
              <div className="p-6 border-t border-white/10 flex flex-col gap-4">
                {/* Language Switcher — all other languages */}
                <div className="flex gap-3 mb-2">
                  {otherLangs.map((l) => (
                    <Link
                      key={l}
                      href={translatedUrls[l] || LANG_HOME[l]}
                      className="text-white/80 hover:text-white transition text-sm"
                      onClick={() => {
                        setMobileOpen(false);
                        setOpenSubmenu(null);
                      }}
                    >
                      {LANG_LABELS[l]}
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                {options?.button_text && (
                  <Link
                    href={langUrl(options.button_url, lang)}
                    className="gap-3 group relative inline-flex items-center
                      rounded-sm bg-[var(--color-accent)] px-6 py-4 text-white
                      transition-all duration-300 hover:bg-[var(--color-accent)]
                      w-[154px] overflow-hidden select-none"
                    onClick={() => {
                      setMobileOpen(false);
                      setOpenSubmenu(null);
                    }}
                  >
                    <span className="relative w-6 flex items-center justify-center">
                      <span
                        className="
                            absolute h-2 w-2 rounded-full bg-[#191F68]
                            transition-all duration-300 ease-out
                            group-hover:opacity-0 group-hover:-translate-x-1
                          "
                      ></span>
                    </span>
                    <span
                      className="text-black
                            flex-1 text-[16px] leading-none
                            transition-all duration-300 ease-out
                            group-hover:-translate-x-4
                            whitespace-nowrap"
                    >
                      {options.button_text}
                    </span>

                    <span className="relative w-4 flex items-center justify-center">
                      <span
                        className="
                              w-4 absolute opacity-0 -translate-x-4
                              transition-all duration-300 ease-out
                              group-hover:opacity-100 group-hover:-translate-x-2
                            "
                      >
                        <Image
                          src={ArrowSvgB}
                          width={13}
                          height={13}
                          alt="arrow"
                        />
                      </span>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

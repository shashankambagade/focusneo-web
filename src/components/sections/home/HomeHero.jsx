"use client";

import Image from "next/image";
import React from "react";
import DownArrow from "../../../../public/hero-down-arrow.png";
import { motion } from "framer-motion";

export default function HomeHero({ data }) {
  const bgImage = data?.bg_image?.url || "";
  const bgVideo = data?.bg_video?.url || "";
  const heading = data?.heading || "";
  const shortHeading = data?.short_heading || "";

  return (
    <section className="relative w-full  overflow-hidden hero">
      {/* BG IMAGE/VIDEO */}
      <div
        className="absolute inset-0 -z-10"
        style={
          bgVideo
            ? {}
            : {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center top", // 👈 IMPORTANT
                backgroundRepeat: "no-repeat",
              }
        }
      >
        {bgVideo && (
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/0 to-black/0 -z-10"></div>

      {/* HERO TEXT */}
      <div className="relative min-h-[100vh] web-width px-6 lg:px-50 py-24 lg:py-36 h-full flex flex-col items-start justify-center lg:justify-start">
        <div className="">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-white"
            dangerouslySetInnerHTML={{
              __html: heading.replace(/<em>(.*?)<\/em>/g, `<em>$1</em>`),
            }}
          />
        </div>
        <div className="lg:m-auto lg:absolute right-[22%] top-[360px]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="body-text max-w-[360px] mt-4 text-white"
            dangerouslySetInnerHTML={{ __html: shortHeading }}
          />
          {/* Scroll Button */}
          <motion.a
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#next")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 w-12 h-12 rounded-full bg-[var(--color-accent)] translate-y-0 transition-all duration-300
                flex items-center justify-center shadow-md hover:translate-y-[6px] cursor-pointer"
          >
            <Image src={DownArrow} alt="arrow" width={13} height={13} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

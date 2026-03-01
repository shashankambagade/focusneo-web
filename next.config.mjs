/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gomowebb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gomowebb.com",
        pathname: "/**",
      },
    ],
  },

  // async redirects() {
  //   return [
  //     {
  //       //source: "/frontpage",
  //       destination: "/",
  //       permanent: true,  // Permanent redirect (HTTP 301)
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      // Root → English homepage
      { source: "/", destination: "/en" },

      // Finnish — pass-through so catch-all doesn't grab /fi/*
      { source: "/fi", destination: "/fi" },
      { source: "/fi/:path*", destination: "/fi/:path*" },

      // Norwegian Bokmål — pass-through
      { source: "/no", destination: "/no" },
      { source: "/no/:path*", destination: "/no/:path*" },

      // Swedish — pass-through
      { source: "/sv", destination: "/sv" },
      { source: "/sv/:path*", destination: "/sv/:path*" },

      // English catch-all: rewrite unprefixed paths to /en/*
      // Negative lookahead excludes existing lang prefixes AND /en itself
      // so /en, /en/about-us etc. are NOT accidentally rewritten to /en/en/*
      {
        source: "/:path((?!en(?:/|$)|fi(?:/|$)|no(?:/|$)|sv(?:/|$)).*)",
        destination: "/en/:path",
      },
    ];
  },
};

export default nextConfig;

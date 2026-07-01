import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect root "/" to "/pwa" — the main mobile app path
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pwa",
        permanent: false, // 307 so it can be changed later
      },
    ];
  },

  // Proper headers for PWA assets
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;

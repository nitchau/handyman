import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "i.pravatar.cc" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/resume.html",
      destination: "/resume",
      permanent: true,
    },
  ],
};

export default nextConfig;

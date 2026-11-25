import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/resume.html",
      destination: "/resume",
      permanent: true,
    },
    // WorkTrack was built and renamed Hourweft.
    { source: "/projects/worktrack", destination: "/projects/hourweft", permanent: true },
  ],
};

export default nextConfig;

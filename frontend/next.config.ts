import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-54f93db1d7794b918097c4779c63f147.r2.dev",
      },
    ],
  },
};

export default nextConfig;

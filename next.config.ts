import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pomodaily.app" }],
        destination: "https://pomodaily.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

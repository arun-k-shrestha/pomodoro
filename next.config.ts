import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pomodaily.app",
          },
        ],
        destination: "https://www.pomodaily.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

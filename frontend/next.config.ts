import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', 
      }
    ]
  },
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "5mb"
    }
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://lifestyle-ayr3.vercel.app/api/:path*"
            }
        ]
    }
};

export default nextConfig;

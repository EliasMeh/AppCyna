import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  async headers() {
    return [
      {
        // Cache images for presentation
        source: '/api/image/presentation/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600'
          },
          {
            key: 'Vary',
            value: 'Accept'
          }
        ]
      },
      {
        // Cache carousel images
        source: '/api/carousel',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=60'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
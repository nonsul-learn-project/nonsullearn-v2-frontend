import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nonsul-learn.com',
        pathname: '/data/**',
      },
    ],
  },
};

export default nextConfig;

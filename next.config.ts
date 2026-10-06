import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nonsul-learn.com',
        pathname: '/data/**',
      },
      {
        protocol: 'https',
        hostname: 'nonsul-learn.com',
        pathname: '/src/nonsul-learn/img/**',
      },
    ],
  },
};

export default nextConfig;

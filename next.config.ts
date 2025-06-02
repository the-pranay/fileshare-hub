import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables that will be available on the client side
  env: {
    CUSTOM_DOMAIN: process.env.VERCEL_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  // Image optimization settings for Vercel
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      }
    ],
  },
  
  // Updated server external packages configuration
  serverExternalPackages: ['mongoose', 'bcryptjs'],

  // Disable ESLint during builds for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during builds for deployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

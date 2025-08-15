/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation completely
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;

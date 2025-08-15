/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Disable static generation
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
};

export default nextConfig;

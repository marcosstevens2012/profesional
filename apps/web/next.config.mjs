/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@profesional/ui", "@profesional/contracts"],
  experimental: {
    externalDir: true,
  },
  images: {
    domains: ['localhost', 'example.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@marcosstevens2012/contracts"],
  experimental: {
    externalDir: true,
  },
  images: {
    domains: ["localhost", "example.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  // Optimización para producción
  swcMinify: true,
  // Asegurar que el output es standalone para mejor rendimiento
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;

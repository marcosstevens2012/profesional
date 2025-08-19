/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@profesional/ui", "@profesional/contracts"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;

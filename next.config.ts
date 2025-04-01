/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.aceternity.com"], // ✅ Allow external image domain
  },
};

export default nextConfig;

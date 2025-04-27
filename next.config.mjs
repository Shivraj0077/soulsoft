/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploads-ssl.webflow.com'],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
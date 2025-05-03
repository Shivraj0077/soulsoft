/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['uploads-ssl.webflow.com'],
    },
    env: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Add your webpack customizations here if needed
      return config
    },
    
  };
  
  export default nextConfig;
  
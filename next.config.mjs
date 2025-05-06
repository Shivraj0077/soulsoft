/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['uploads-ssl.webflow.com'],
    },
    env: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
      COMPANY_EMAIL: process.env.COMPANY_EMAIL,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Add your webpack customizations here if needed
      return config
    },
    experimental: {
      serverActions: {},
    },
    
  };
  
  export default nextConfig;
  
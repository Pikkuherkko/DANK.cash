/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_URL_2: process.env.RPC_URL_2,
  },
};

module.exports = nextConfig;

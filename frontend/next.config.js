/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav)$/,
      type: 'asset/resource'
    });
    return config;
  }
};

module.exports = nextConfig; 
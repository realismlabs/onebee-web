// next.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  analyzerPort: 8889, // Change this to an available port
});

const nextConfig = {
  reactStrictMode: true,
  // used to prevent needing a Next.js server for images
  images: {
    unoptimized: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);

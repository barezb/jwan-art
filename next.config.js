/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization
  images: {
    domains: [
      "s3.amazonaws.com",
      "your-bucket-name.s3.amazonaws.com",
      "your-bucket-name.s3.us-east-1.amazonaws.com",
      // Add your S3 bucket domain here
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    // Enable if you want to use the new app directory (Next.js 13+)
    // appDir: true,
  },

  // Webpack configuration for custom optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack optimizations can go here
    return config;
  },

  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // API routes configuration
  async rewrites() {
    return [
      // Add any custom rewrites here if needed
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      // Add redirects here if needed
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // Compression and performance
  compress: true,
  poweredByHeader: false,

  // i18n configuration (if needed for multiple languages)
  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  // },
};

module.exports = nextConfig;
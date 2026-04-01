import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["@ffprobe-installer/ffprobe", "fluent-ffmpeg"],

  async redirects() {
    return [
      {
        // Matches /en, /zh, /tl, etc. and any sub-paths
        // But NOT /api routes
        source: '/:lang([a-z]{2})/:path((?!api/).*)',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

  // Turbopack config (Next.js 16+ default bundler)
  turbopack: {},

  // Webpack fallback for tiktoken WASM support
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

export default withNextIntl(nextConfig);

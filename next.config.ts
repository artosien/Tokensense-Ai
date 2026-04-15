import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  serverExternalPackages: [
    "@ffprobe-installer/ffprobe",
    "fluent-ffmpeg",
    "tiktoken",
    "pdfjs-dist",
  ],

  async redirects() {
    return [
      {
        // Redirect /{lang}/{path} to /{path} for supported locales
        // This explicitly lists supported locales to avoid matching /api
        source: '/:lang(ar|de|en|es|fr|hi|id|ja|ko|pt-BR|zh)/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

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

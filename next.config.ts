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
        // Redirect /{lang}/{path} to /{path}
        // Matches /en/about, /es/blog/foo, etc.
        source: '/:lang([a-z]{2})/:path*',
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

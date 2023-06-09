// @ts-check
import "./src/env.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import("next").NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import("next").NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/uploaded/**"
      }
    ]
  },
  reactStrictMode: false,
  swcMinify: true,
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };

    return config;
  },
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  }
});

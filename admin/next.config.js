const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  output: "standalone",
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./global";`,
  },
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `${process.env.API_TARGET}/:path*`, // Proxy to API server
      },
    ];
  },
  webpack(config) {
    // From https://nanxiaobei.medium.com/disable-css-modules-in-next-js-project-756835172b6e
    // remove css module
    // Find and remove NextJS css rules.
    for (const rule of config.module.rules) {
      if (rule.oneOf) {
        rule.oneOf.forEach((one) => {
          if (!`${one.issuer ? one.issuer.and : "undefined"}`.includes("_app"))
            return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    }

    return config;
  },
});

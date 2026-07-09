import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    SERWIST_SUPPRESS_TURBOPACK_WARNING: "1",
  },
};

export default withSerwist(nextConfig);

import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sampleRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@dtechph/wayfinding-web", "@dtechph/wayfinding-core"],
  // file: deps resolve into DuonCore/DuonSDK, outside this app directory.
  outputFileTracingRoot: path.resolve(sampleRoot, "../.."),
};

export default nextConfig;

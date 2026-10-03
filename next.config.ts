import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
/** Situm SDK lives beside DuonSamples; allow Next/Turbopack to resolve the file: link. */
const monorepoRoot = path.join(appRoot, "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@dtechph/wayfinding-web", "@dtechph/wayfinding-core"],
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;

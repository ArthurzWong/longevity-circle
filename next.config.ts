import type { NextConfig } from "next";

/**
 * Two build modes:
 * - Default (`next build`): full server build for Vercel. Includes API routes
 *   (`app/api/**`) such as the LLM proxy at /api/ai/chat.
 * - Static export (`STATIC_EXPORT=1 next build` or `npm run build:static`):
 *   client-only demo build for static hosting. The build script temporarily
 *   stages `app/api` out because route handlers cannot be statically exported.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isStaticExport ? { output: "export" as const } : {}),
};

export default nextConfig;

// ═══════════════════════════════════════════════════════════════
// build-static.mjs — static-export helper for demo hosting.
//
// Next.js route handlers cannot be statically exported, so this
// script temporarily moves app/api out of the tree, runs
// `STATIC_EXPORT=1 next build`, then restores it.
// The normal server build (`next build`) keeps API routes intact.
// ═══════════════════════════════════════════════════════════════

import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "app", "api");
const stagedDir = path.join(root, ".staged-api");

function main() {
  const hasApi = existsSync(apiDir);
  if (hasApi) {
    rmSync(stagedDir, { recursive: true, force: true });
    mkdirSync(path.dirname(stagedDir), { recursive: true });
    renameSync(apiDir, stagedDir);
  }
  try {
    execSync("npx next build", {
      stdio: "inherit",
      env: { ...process.env, STATIC_EXPORT: "1" },
    });
    // Copy export output to project root index for static hosting.
    const outDir = path.join(root, "out");
    if (existsSync(outDir)) {
      const hostDir = path.join(root, "..", "website-static-host");
      rmSync(hostDir, { recursive: true, force: true });
      cpSync(outDir, hostDir, { recursive: true });
      console.log(`[build-static] export copied to ${hostDir}`);
    }
  } finally {
    if (hasApi && existsSync(stagedDir)) {
      renameSync(stagedDir, apiDir);
    }
  }
}

main();

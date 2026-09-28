// ─────────────────────────────────────────────────────────────
// Data provider resolver — swap persistence without touching UI.
//   NEXT_PUBLIC_DATA_PROVIDER=demo      (default, localStorage)
//   NEXT_PUBLIC_DATA_PROVIDER=supabase  (PostgreSQL + Auth + Storage)
// Both modules are side-effect-free at import time; the Supabase
// client only initialises when a method actually runs.
// ─────────────────────────────────────────────────────────────

import { DemoDataProvider } from "@/lib/data/demo-provider";
import { SupabaseDataProvider } from "@/lib/data/supabase-provider";
import type { DataProvider } from "@/lib/types";

let resolved: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (resolved) return resolved;
  resolved =
    process.env.NEXT_PUBLIC_DATA_PROVIDER === "supabase"
      ? new SupabaseDataProvider()
      : new DemoDataProvider();
  return resolved;
}

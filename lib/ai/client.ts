// ─────────────────────────────────────────────────────────────
// AI client abstraction (browser side).
// demo   → local composer, no network
// server → POST /api/ai/chat (keys stay server-side)
// ─────────────────────────────────────────────────────────────

import { generateDemoReply, suggestedPrompts } from "@/lib/ai/composer";
import type { AiMessage, LabelledStatement } from "@/lib/types";

export type AiMode = "demo" | "server";

export interface AiReply {
  content: string;
  labels: LabelledStatement[];
  sources: { sourceKey: string; title: string }[];
  provider: AiMode | string;
}

export function aiMode(): AiMode {
  return process.env.NEXT_PUBLIC_AI_MODE === "server" ? "server" : "demo";
}

export { suggestedPrompts };

export async function sendChat(
  userMessage: string,
  history: AiMessage[],
  context?: { displayName?: string }
): Promise<AiReply> {
  if (aiMode() === "demo") {
    const r = generateDemoReply(userMessage, history, context);
    return { content: r.reply, labels: r.labels, sources: r.sources, provider: "demo" };
  }

  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ],
      context,
    }),
  });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  const data = (await res.json()) as { content: string; sources?: AiReply["sources"]; provider?: string };
  return {
    content: data.content,
    labels: [],
    sources: data.sources ?? [],
    provider: data.provider ?? "server",
  };
}

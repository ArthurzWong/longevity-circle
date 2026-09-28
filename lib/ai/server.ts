// ─────────────────────────────────────────────────────────────
// AI provider abstraction — server side.
// Swap LLM_PROVIDER without touching app code:
//   demo      → rule-based composer (no external calls)
//   openai    → OpenAI Chat Completions
//   anthropic → Anthropic Messages API
// Keys never reach the browser; the client talks to /api/ai/chat.
// ─────────────────────────────────────────────────────────────

import { generateDemoReply } from "@/lib/ai/composer";
import { retrieve } from "@/lib/rag/retrieval";
import { scanBannedClaims, scanUserInput } from "@/lib/safety/guardrails";
import type { AiMessage } from "@/lib/types";

export type LLMProviderId = "demo" | "openai" | "anthropic";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages: ChatTurn[];
  context?: {
    displayName?: string;
    profileSummary?: string;
  };
}

export interface LLMResponse {
  content: string;
  sources: { sourceKey: string; title: string }[];
  labels: { label: string; text: string }[];
  provider: LLMProviderId;
}

// Section contract enforced on every server-mode response.
const FORMAT_CONTRACT = `You are Longevity AI, an educational longevity-wellness assistant.
HARD RULES:
- Use EXACTLY these sections, in order, as markdown bold headers:
  **ANSWER**, **WHAT THE EVIDENCE SAYS**, **WHAT IS UNCERTAIN**, **HOW THIS MAY RELATE TO YOU**, **POSSIBLE NEXT STEP**, **WHEN TO CONSULT A PROFESSIONAL**, **SOURCES**
- Label statements as [FACT], [RESEARCH FINDING], [EXPERT OPINION], [USER DATA], or [UNCERTAINTY] inline.
- Cite ONLY the sources given in the retrieved context below, by their [sourceKey].
- NEVER fabricate citations, authors, titles, or URLs.
- NEVER claim to reverse ageing, reduce biological age, add years to life, predict lifespan, diagnose, or prescribe. If the user asks for these, explain the limit and encourage a qualified professional.
- If the user describes a medical emergency, instruct them to contact emergency services immediately.
- Educational tone: calm, evidence-aware, non-clinical.`;

function buildRagContext(query: string): { block: string; sources: { sourceKey: string; title: string }[] } {
  const { chunks, sources } = retrieve(query);
  if (chunks.length === 0) return { block: "No retrieved context. Say so honestly in ANSWER.", sources: [] };
  const block = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.chunk.title} — ${c.chunk.author} (${c.chunk.publicationDate ?? "n.d."}) [${c.chunk.sourceType}/${c.chunk.evidenceLevel ?? "ungraded"}] sourceKey=${c.chunk.sourceId}\nCLAIM: ${c.chunk.claim}\nCONTENT: ${c.chunk.content}`
    )
    .join("\n\n");
  return { block, sources: sources.map((s) => ({ sourceKey: s.sourceKey, title: s.title })) };
}

async function callOpenAI(req: LLMRequest, systemPrompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...req.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(req: LLMRequest, systemPrompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = (await res.json()) as { content?: { text?: string }[] };
  return data.content?.map((c) => c.text ?? "").join("") ?? "";
}

export async function chat(req: LLMRequest): Promise<LLMResponse> {
  const provider = (process.env.LLM_PROVIDER as LLMProviderId) || "demo";
  const lastUser = [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Safety scan on user input first (all providers).
  const safety = scanUserInput(lastUser);
  if (safety.flagged && safety.safeResponse) {
    return {
      content: safety.safeResponse,
      sources: [],
      labels: [{ label: "UNCERTAINTY", text: "Safety guardrail engaged." }],
      provider,
    };
  }

  if (provider === "demo") {
    const history: AiMessage[] = req.messages.map((m, i) => ({
      id: `m${i}`,
      role: m.role,
      content: m.content,
      createdAt: new Date().toISOString(),
    }));
    const r = generateDemoReply(lastUser, history, { displayName: req.context?.displayName });
    return { content: r.reply, sources: r.sources, labels: r.labels, provider };
  }

  const { block, sources } = buildRagContext(lastUser);
  const systemPrompt = `${FORMAT_CONTRACT}\n\nRETRIEVED CONTEXT (the only citable sources):\n${block}`;

  let content: string;
  if (provider === "openai") content = await callOpenAI(req, systemPrompt);
  else content = await callAnthropic(req, systemPrompt);

  if (!content) throw new Error("Empty LLM response");

  const banned = scanBannedClaims(content);
  if (banned.flagged) {
    content =
      "I can't provide that framing — Longevity Circle never predicts lifespan, claims to reverse ageing, or offers medical advice. " +
      "Happy to share what the evidence says about specific habits instead.";
  }

  return { content, sources, labels: [], provider };
}

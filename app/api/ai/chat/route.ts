import { NextResponse } from "next/server";
import { chat } from "@/lib/ai/server";

export const runtime = "nodejs";

/**
 * POST /api/ai/chat
 * Body: { messages: {role, content}[], context?: {displayName?, profileSummary?} }
 * Provider selected by LLM_PROVIDER (demo | openai | anthropic).
 * Keys stay server-side; the browser only ever talks to this route.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: { role: string; content: string }[];
      context?: { displayName?: string; profileSummary?: string };
    };

    const messages = (body.messages ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Provide at least one user message." }, { status: 400 });
    }

    const result = await chat({ messages, context: body.context });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/ai/chat]", err);
    return NextResponse.json(
      { error: "AI request failed. Check server logs and LLM configuration." },
      { status: 500 }
    );
  }
}

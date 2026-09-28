"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";
import { aiMode, sendChat, suggestedPrompts } from "@/lib/ai/client";
import { getDataProvider } from "@/lib/data/provider";
import type { AiMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABEL_TONES: Record<string, string> = {
  "FACT": "bg-sage-50 text-sage-700 border-sage-200",
  "RESEARCH FINDING": "bg-gold-50 text-gold-700 border-gold-300/60",
  "EXPERT OPINION": "bg-parchment text-ink-soft border-sage-200",
  "USER DATA": "bg-white text-sage-800 border-sage-300",
  "UNCERTAINTY": "bg-clay-100 text-clay-600 border-clay-500/40",
};

export default function AiPage() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState<string>("friend");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDataProvider().getProfile().then((p) => p?.displayName && setDisplayName(p.displayName));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    const userMsg: AiMessage = { id: `u-${Date.now()}`, role: "user", content: msg, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    try {
      const reply = await sendChat(msg, messages, { displayName });
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: reply.content, labels: reply.labels, sources: reply.sources, createdAt: new Date().toISOString() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `a-err`, role: "assistant", content: "Something went wrong reaching the AI. Please try again.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-2xl flex-col px-5 pb-24 pt-8" style={{ minHeight: "100dvh" }}>
      <PageHeader
        eyebrow="Longevity AI"
        title="Ask, understand, decide"
        subtitle="Every answer separates fact, research, expert opinion, your data, and uncertainty — with sources."
      />
      <div className="mb-3">
        <Badge variant={aiMode() === "demo" ? "muted" : "default"}>
          {aiMode() === "demo" ? "Demo intelligence · grounded in seeded evidence" : "Server LLM via /api/ai/chat"}
        </Badge>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col">
          <p className="mt-4 mb-3 text-sm font-medium text-ink-soft">Suggested prompts</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-xl border border-sage-200 bg-white/70 p-3.5 text-left text-[13px] leading-snug text-ink-soft transition-all hover:border-sage-400 hover:shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            Longevity AI provides education only. It does not diagnose, prescribe, or replace professional care, and it never predicts lifespan.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[92%] rounded-2xl px-4 py-3",
                  m.role === "user" ? "bg-sage-700 text-paper" : "border border-sage-200/80 bg-white/80"
                )}
              >
                {m.role === "assistant" ? (
                  <>
                    <div className="ai-prose text-sm text-ink-soft">{m.content}</div>
                    {m.labels && m.labels.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-sage-100 pt-2.5">
                        {m.labels.map((l, i) => (
                          <span key={`${l.label}-${i}`} className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide", LABEL_TONES[l.label] ?? "border-sage-200 text-ink-faint")}>
                            {l.label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {m.sources && m.sources.length > 0 ? (
                      <div className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                        Sources: {m.sources.map((s) => s.sourceKey).join(" · ")}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {busy ? <p className="text-xs text-ink-faint">Composing an evidence-aware answer…</p> : null}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="sticky bottom-20 mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about sleep, strength, fasting, evidence…"
          className="h-12 flex-1 rounded-2xl border border-sage-200 bg-white/90 px-4 text-sm focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20"
          aria-label="Message Longevity AI"
        />
        <Button size="lg" onClick={() => send(input)} disabled={busy || !input.trim()}>Send</Button>
      </div>
      <p className="mt-2 text-center text-[10px] leading-relaxed text-ink-faint/70">
        Educational tool — not medical care. In emergencies, contact local emergency services.
      </p>
    </main>
    </AppShell>
  );
}

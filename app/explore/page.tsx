"use client";

import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EvidenceStrengthBadge, PageHeader } from "@/components/shared";
import { searchEvidenceCards } from "@/lib/rag/retrieval";
import { seedEvidenceCards } from "@/lib/seed/knowledge";
import type { EvidenceCard } from "@/lib/types";

const SUGGESTED = ["fasting", "sleep", "strength", "steps", "meditation", "protein", "coffee", "connection", "supplements", "mobility"];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const results: EvidenceCard[] = useMemo(
    () => (query.trim() ? searchEvidenceCards(query) : seedEvidenceCards),
    [query]
  );

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Evidence Explorer"
        title="What does the evidence actually say?"
        subtitle="Structured evidence briefs with sources, strength, and honest uncertainty. Educational — not medical advice."
      />

      <div className="sticky top-0 z-20 -mx-5 bg-paper/95 px-5 pb-3 pt-1 backdrop-blur">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(null);
          }}
          placeholder='Try: "Does fasting improve longevity?"'
          className="h-12 rounded-2xl text-base"
          aria-label="Search longevity questions"
        />
        <div className="rail mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="shrink-0 rounded-full border border-sage-200 bg-white/70 px-3 py-1 text-xs text-ink-soft hover:border-sage-400"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-6 text-sm leading-relaxed text-ink-faint">
            No evidence brief matches that yet. The knowledge base currently covers sleep, movement, strength, fasting,
            protein, coffee, stress, connection, supplements, and mobility — try one of the topics above.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 space-y-3">
          {results.map((card) => {
            const open = active === card.id;
            return (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <button className="w-full text-left" onClick={() => setActive(open ? null : card.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[15px] font-semibold leading-snug text-ink">{card.question}</h3>
                      <span className="mt-0.5 shrink-0 text-xs text-ink-faint">{open ? "▲" : "▼"}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <EvidenceStrengthBadge strength={card.evidenceStrength} />
                      {card.tags.slice(0, 3).map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{card.shortAnswer}</p>
                  </button>

                  {open ? (
                    <div className="mt-4 space-y-4 border-t border-sage-100 pt-4 text-sm">
                      <Section title="What studies show">{card.whatStudiesShow}</Section>
                      <Section title="What remains uncertain">{card.whatRemainsUncertain}</Section>
                      <Section title="Population & context">{card.populationContext}</Section>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ListBlock title="Potential benefits" items={card.potentialBenefits} tone="plus" />
                        <ListBlock title="Potential risks" items={card.potentialRisks} tone="minus" />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Expert perspectives</p>
                        <ul className="space-y-1.5">
                          {card.expertPerspectives.map((p) => (
                            <li key={p} className="text-[13px] leading-relaxed text-ink-soft">{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Sources</p>
                        <ul className="space-y-1">
                          {card.sourceKeys.map((k) => (
                            <li key={k} className="text-[12px] text-ink-faint">[{k}]</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint/80">
                          Full metadata (authors, dates, populations) for every source is stored in the research_sources table and shown in the AI answers.
                        </p>
                      </div>
                      <p className="text-[11px] leading-relaxed text-ink-faint">
                        Educational summary — not diagnosis or treatment. For personal decisions, consult a qualified professional.{" "}
                        <Link href="/ai" className="text-sage-700 underline">Ask Longevity AI about this →</Link>
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">{title}</p>
      <p className="leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "plus" | "minus" }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">{title}</p>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
            <span className={tone === "plus" ? "text-sage-600" : "text-clay-600"}>{tone === "plus" ? "+" : "–"}</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

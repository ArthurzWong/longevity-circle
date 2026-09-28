"use client";

import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { DemoBadge } from "@/components/shared";
import { seedExperts, seedExpertContent, seedKnowledgeCards } from "@/lib/seed/data";

const KIND_ICON: Record<string, string> = {
  video: "▶", audio: "🎧", article: "📄", pdf: "📕", transcript: "💬", research: "🔬",
};

export default function CirclePage() {
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Record<string, boolean>>({});

  const expert = useMemo(() => seedExperts.find((e) => e.slug === selectedExpert) ?? null, [selectedExpert]);
  const content = useMemo(
    () => (expert ? seedExpertContent.filter((c) => c.expertId === expert.id) : seedExpertContent),
    [expert]
  );
  const cards = useMemo(
    () => (expert ? seedKnowledgeCards.filter((k) => content.some((c) => c.id === k.contentId)) : []),
    [expert, content]
  );

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Expert Circle"
        title="Learn from practitioners"
        subtitle="Curated expert content with AI-generated knowledge cards, FAQs, and discussion questions."
      />

      {!expert ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {seedExperts.map((e) => (
              <Card key={e.id} className="transition-shadow hover:shadow-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-[15px] font-semibold text-ink">{e.name}</p>
                    <DemoBadge />
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-ink-faint">{e.credentials}</p>
                  <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">{e.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.focusAreas.slice(0, 3).map((f) => <Badge key={f} variant="muted">{f}</Badge>)}
                  </div>
                  <Button size="sm" variant="outline" className="mt-3.5" onClick={() => setSelectedExpert(e.slug)}>
                    View profile & content
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            All experts in this build are fictional and clearly labelled DEMO — no real doctors&apos; names, photographs, or endorsements are used without permission.
          </p>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={() => setSelectedExpert(null)}>← All experts</Button>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink">{expert.name}</h1>
              <DemoBadge />
            </div>
            <p className="mt-1 text-xs text-ink-faint">{expert.credentials}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{expert.bio}</p>
          </div>

          <section className="mt-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Content</h2>
            <div className="space-y-2.5">
              {content.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold text-ink">{KIND_ICON[c.kind]} {c.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-faint">{c.summary}</p>
                      </div>
                      <Badge variant="muted">{c.durationOrPages}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline">{c.kind}</Badge>
                      <Button
                        size="sm"
                        variant={generated[c.id] ? "outline" : "gold"}
                        onClick={() => setGenerated((g) => ({ ...g, [c.id]: true }))}
                      >
                        {generated[c.id] ? "Cards generated ✓" : "Generate knowledge cards"}
                      </Button>
                    </div>

                    {generated[c.id] ? (
                      <div className="mt-3 space-y-2 border-t border-sage-100 pt-3">
                        {seedKnowledgeCards.filter((k) => k.contentId === c.id).map((k) => (
                          <div key={k.id} className="rounded-xl bg-sage-50/80 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[13px] font-semibold text-ink">{k.title}</p>
                              <Badge variant={k.kind === "faq" ? "gold" : k.kind === "discussion" ? "outline" : "default"}>{k.kind.replace("_", " ")}</Badge>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{k.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {cards.length > 0 ? (
            <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
              Cards are AI-generated study aids from the expert&apos;s (demo) material — always check the original content.
            </p>
          ) : null}
        </>
      )}
    </main>
    </AppShell>
  );
}

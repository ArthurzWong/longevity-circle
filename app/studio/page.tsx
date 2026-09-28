"use client";

import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { DemoBadge } from "@/components/shared";

const STAGES = [
  ["UPLOAD", "Video, audio, PDF, presentation"],
  ["TRANSCRIBE", "Speech-to-text (provider-pluggable)"],
  ["CHUNK", "Semantic splitting, overlap preserved"],
  ["EMBED", "Vector embeddings per chunk"],
  ["INDEX", "pgvector HNSW index"],
  ["EXTRACT INSIGHTS", "Claims, evidence level, population"],
  ["KNOWLEDGE CARDS", "Key takeaways per section"],
  ["FAQ", "Common questions answered from content"],
  ["DISCUSSION QUESTIONS", "Circle-ready prompts"],
  ["EXPERIMENT IDEAS", "Safe, habit-level suggestions"],
];

export default function StudioPage() {
  const [files, setFiles] = useState<{ name: string; progress: number }[]>([]);
  const [running, setRunning] = useState(false);

  const simulate = () => {
    const name = `demo-talk-${String(files.length + 1).padStart(2, "0")}.mp4`;
    setFiles((f) => [...f, { name, progress: 0 }]);
    setRunning(true);
  };

  // Demo pipeline animation: progress ticks up; a real build calls the
  // transcription provider then the embed/index endpoints.
  useState(() => {
    if (typeof window === "undefined") return;
    const t = window.setInterval(() => {
      setFiles((fs) => {
        const active = fs.find((f) => f.progress < 100);
        if (!active) {
          setRunning(false);
          return fs;
        }
        return fs.map((f) => (f === active ? { ...f, progress: Math.min(100, f.progress + 17) } : f));
      });
    }, 400);
    return () => window.clearInterval(t);
  });

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <div className="flex items-center gap-2">
        <PageHeader
          eyebrow="Creator Studio"
          title="From raw content to structured knowledge"
          subtitle="Upload expert material; the pipeline transcribes, chunks, embeds, and generates study assets."
        />
        <DemoBadge />
      </div>

      <Card className="mb-5 border-dashed border-sage-300 bg-white/50">
        <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
          <p className="font-display text-sm font-semibold text-ink">Upload content</p>
          <p className="max-w-sm text-xs leading-relaxed text-ink-faint">
            Video, audio, PDF, or presentation. The pipeline runs through ten stages — you watch each one.
          </p>
          <Button className="mt-2" onClick={simulate} disabled={running}>
            {running ? "Pipeline running…" : "Add demo file to pipeline"}
          </Button>
        </CardContent>
      </Card>

      {/* Pipeline visual */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Pipeline</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {STAGES.map(([stage, hint], i) => (
              <div key={stage} className="rounded-xl border border-sage-200/70 bg-white/70 p-3">
                <p className="text-[10px] font-bold tracking-wide text-sage-700">{String(i + 1).padStart(2, "0")} {stage}</p>
                <p className="mt-1 text-[10px] leading-snug text-ink-faint">{hint}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {files.map((f) => (
        <Card key={f.name} className="mb-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">{f.name}</p>
              <Badge variant={f.progress >= 100 ? "default" : "gold"}>{f.progress >= 100 ? "indexed ✓" : `${f.progress}%`}</Badge>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-sage-600 transition-all" style={{ width: `${f.progress}%` }} />
            </div>
            {f.progress >= 100 ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-sage-50/80 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-700">Sample output · knowledge card</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">“The single highest-leverage habit is the one you can repeat on your worst week.”</p>
                </div>
                <div className="rounded-xl bg-gold-50/80 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-700">Sample output · experiment idea</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">14-day habit-stacking trial: attach 5 minutes of mobility to an existing evening routine.</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}

      <SafetyBanner>
        Creator Studio output is educational study material, not medical guidance. Generated experiment ideas stay at habit level (sleep, movement, nutrition, stress) — never interventions.
      </SafetyBanner>
    </main>
    </AppShell>
  );
}

"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import type { MonthlyReport } from "@/lib/types";

export default function ReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    getDataProvider().getReports().then((r) => {
      setReports(r);
      setOpen(r[1]?.id ?? r[0]?.id ?? null);
    });
  }, []);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Monthly Reports"
        title="Reflect on the month"
        subtitle="What changed, what you completed, and what's worth discussing — generated from your own self-reported data."
      />
      <SafetyBanner>
        Reports describe self-reported patterns. They never claim to reverse ageing, reduce biological age, or add years to life — and they are not medical assessments.
      </SafetyBanner>

      <div className="mt-5 space-y-3">
        {reports.map((r) => {
          const isOpen = open === r.id;
          return (
            <Card key={r.id}>
              <CardContent className="p-4">
                <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(isOpen ? null : r.id)}>
                  <div className="flex items-center gap-2.5">
                    <p className="font-display text-[15px] font-semibold text-ink">{r.month}</p>
                    {r.month.includes("preview") ? <Badge variant="muted">in progress</Badge> : <Badge variant="gold">final</Badge>}
                  </div>
                  <span className="text-xs text-ink-faint">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen ? (
                  <div className="mt-4 space-y-4 border-t border-sage-100 pt-4 text-sm">
                    <Block title="What changed" items={r.whatChanged} />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Experiments completed</span>
                      <Badge>{r.experimentsCompleted}</Badge>
                    </div>
                    <Block title="Habit trends" items={r.habitTrends} />
                    <Block title="Personal reflections" items={r.personalReflections} />
                    {r.questionsForProfessional.length > 0 ? (
                      <div className="rounded-xl border border-gold-300/50 bg-gold-50/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700">Questions for professional discussion</p>
                        <ul className="mt-2 space-y-1.5">
                          {r.questionsForProfessional.map((q) => <li key={q} className="text-[13px] leading-relaxed text-ink-soft">· {q}</li>)}
                        </ul>
                        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">Bring these to your next check-up — this list is a conversation aid, not medical advice.</p>
                      </div>
                    ) : null}
                    <Block title="Next month's focus" items={r.nextFocus} />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
    </AppShell>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">{title}</p>
      <ul className="space-y-1.5">
        {items.map((i) => <li key={i} className="text-[13px] leading-relaxed text-ink-soft">· {i}</li>)}
      </ul>
    </div>
  );
}

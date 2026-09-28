"use client";

import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { seedExperts, seedExpertContent, seedPosts } from "@/lib/seed/data";
import { seedEvidenceCards, seedSources } from "@/lib/seed/knowledge";
import { seedExperimentTemplates } from "@/lib/seed/data";

type Tab = "users" | "experts" | "content" | "sources" | "experiments" | "circles" | "flagged";

const TABS: [Tab, string, number][] = [
  ["users", "Users", 1],
  ["experts", "Experts", seedExperts.length],
  ["content", "Content", seedExpertContent.length],
  ["sources", "Sources", seedSources.length],
  ["experiments", "Experiments", seedExperimentTemplates.length],
  ["circles", "Circles", 5],
  ["flagged", "Flagged", seedPosts.filter((p) => p.status === "flagged").length],
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform console"
        subtitle="Manage users, experts, content, sources, experiments, circles, and flagged content. Role-based access applies in production."
      />
      <SafetyBanner>
        Admin actions are audit-logged (audit_logs table). In production this screen requires the admin role via Supabase Auth + RLS.
      </SafetyBanner>

      <div className="rail mt-5 mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([id, label, count]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium ${tab === id ? "border-sage-600 bg-sage-600 text-paper" : "border-sage-200 bg-white/70 text-ink-soft"}`}
          >
            {label} <span className="opacity-60">{count}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="divide-y divide-sage-100 p-0">
          {tab === "users" && (
            <Row main="Arthur (demo)" sub="role: admin · onboarded · private profile" badge={<Badge>active</Badge>} action="View" />
          )}
          {tab === "experts" && seedExperts.map((e) => (
            <Row key={e.id} main={e.name} sub={e.credentials} badge={<DemoBadgeInline />} action="Edit" />
          ))}
          {tab === "content" && seedExpertContent.map((c) => (
            <Row key={c.id} main={c.title} sub={`${c.kind} · ${c.durationOrPages} · ${c.publishedAt}`} badge={<Badge variant={c.status === "published" ? "default" : "warn"}>{c.status}</Badge>} action="Edit" />
          ))}
          {tab === "sources" && seedSources.map((s) => (
            <Row key={s.id} main={s.title} sub={`${s.sourceType} · ${s.author} · ${s.publicationDate ?? "n.d."}`} badge={<Badge variant="muted">{s.evidenceLevel}</Badge>} action="View" />
          ))}
          {tab === "experiments" && seedExperimentTemplates.map((t) => (
            <Row key={t.key} main={t.title} sub={`${t.domain} · ${t.durationDays}d · template`} badge={<Badge variant="muted">template</Badge>} action="Edit" />
          ))}
          {tab === "circles" && ["Sleep", "Strength", "Nutrition", "Mind", "50+ Performance"].map((c) => (
            <Row key={c} main={c} sub="community circle · educational guidelines active" badge={<Badge>live</Badge>} action="Manage" />
          ))}
          {tab === "flagged" && seedPosts.filter((p) => p.status === "flagged").map((p) => (
            <Row key={p.id} main={p.title} sub={`safety flag: ${p.safetyFlag} · ${p.createdAt}`} badge={<Badge variant="warn">flagged</Badge>} action="Review" />
          ))}
          {tab === "flagged" && seedPosts.filter((p) => p.status === "flagged").length === 0 ? (
            <p className="p-5 text-sm text-ink-faint">Nothing flagged right now.</p>
          ) : null}
        </CardContent>
      </Card>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
        Evidence cards in rotation: {seedEvidenceCards.length} · Knowledge chunks indexed: 21 · Citation integrity: every AI citation resolves to research_sources.
      </p>
    </main>
    </AppShell>
  );
}

function Row({ main, sub, badge, action }: { main: string; sub: string; badge: React.ReactNode; action: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{main}</p>
        <p className="truncate text-[11px] text-ink-faint">{sub}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {badge}
        <Button size="sm" variant="ghost">{action}</Button>
      </div>
    </div>
  );
}

function DemoBadgeInline() {
  return <Badge variant="demo">demo</Badge>;
}

"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, OptionGrid, Textarea } from "@/components/ui/input";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import { seedExperimentTemplates } from "@/lib/seed/data";
import type { DomainKey, Experiment } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = "hub" | "create" | "detail";

export default function ExperimentsPage() {
  const [view, setView] = useState<View>("hub");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selected, setSelected] = useState<Experiment | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDataProvider().getExperiments().then((e) => {
      setExperiments(e);
      setLoaded(true);
    });
  }, []);

  const refresh = async () => {
    const e = await getDataProvider().getExperiments();
    setExperiments(e);
  };

  const active = experiments.filter((e) => e.status === "active");
  const completed = experiments.filter((e) => e.status === "completed");
  const drafts = experiments.filter((e) => e.status === "draft");

  if (!loaded) {
    return <main className="mx-auto max-w-2xl px-5 py-10 text-sm text-ink-faint">Loading experiments…</main>;
  }

  if (view === "create") {
    return (
      <CreateForm
        onDone={async (created) => {
          await refresh();
          setSelected(created ?? null);
          setView(created ? "detail" : "hub");
        }}
        onCancel={() => setView("hub")}
      />
    );
  }

  if (view === "detail" && selected) {
    return (
      <ExperimentDetail
        experiment={experiments.find((e) => e.id === selected.id) ?? selected}
        onBack={async () => {
          await refresh();
          setSelected(null);
          setView("hub");
        }}
        onChanged={refresh}
      />
    );
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Experiments"
        title="Test it on yourself, safely"
        subtitle="Small, time-boxed self-experiments with daily check-ins. Educational self-tracking — never a medical intervention."
      />

      <div className="mb-6">
        <Button onClick={() => setView("create")}>+ Create an experiment</Button>
      </div>

      {active.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Active</h2>
          <div className="space-y-3">
            {active.map((e) => <ExperimentRow key={e.id} e={e} onOpen={() => { setSelected(e); setView("detail"); }} />)}
          </div>
        </section>
      )}

      {drafts.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Drafts</h2>
          <div className="space-y-3">
            {drafts.map((e) => <ExperimentRow key={e.id} e={e} onOpen={() => { setSelected(e); setView("detail"); }} />)}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Completed</h2>
          <div className="space-y-3">
            {completed.map((e) => <ExperimentRow key={e.id} e={e} onOpen={() => { setSelected(e); setView("detail"); }} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Template library</h2>
        <p className="mb-3 text-xs leading-relaxed text-ink-faint">
          Seed templates: sleep, walking, strength, meditation, caffeine timing, nutrition habit, mobility. Create your own from any of them.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {seedExperimentTemplates.map((t) => (
            <Card key={t.key}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-ink">{t.title}</p>
                  <Badge variant="muted">{t.durationDays}d</Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">{t.goal}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <Badge>{t.domain}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => setView("create")}>Use →</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
    </AppShell>
  );
}

function ExperimentRow({ e, onOpen }: { e: Experiment; onOpen: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = e.checkins.some((c) => c.createdAt.slice(0, 10) === today);
  return (
    <Card>
      <CardContent className="p-4">
        <button className="w-full text-left" onClick={onOpen}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-ink">{e.title}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{e.goal}</p>
            </div>
            <Badge variant={e.status === "active" ? "default" : e.status === "completed" ? "gold" : "muted"}>{e.status}</Badge>
          </div>
          {e.status === "active" ? (
            <>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-sage-600" style={{ width: `${Math.round((e.checkins.length / e.durationDays) * 100)}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-ink-faint">{e.checkins.length}/{e.durationDays} check-ins {doneToday ? "· today done ✓" : "· check-in due"}</p>
            </>
          ) : null}
        </button>
      </CardContent>
    </Card>
  );
}

function CreateForm({ onDone, onCancel }: { onDone: (created: Experiment | null) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [domain, setDomain] = useState<string[]>([]);
  const [durationDays, setDuration] = useState("14");
  const [protocol, setProtocol] = useState("");
  const [metrics, setMetrics] = useState("");
  const [baselineNote, setBaselineNote] = useState("");
  const [saving, setSaving] = useState(false);
  const domainValue = domain[0] as DomainKey | undefined;

  const canSave = useMemo(() => title.trim() && goal.trim() && domainValue && protocol.trim() && metrics.trim(), [title, goal, domainValue, protocol, metrics]);

  const submit = async () => {
    setSaving(true);
    try {
      const created = await getDataProvider().createExperiment({
        templateKey: null,
        title: title.trim(),
        goal: goal.trim(),
        domain: domainValue!,
        durationDays: Math.max(3, Math.min(90, parseInt(durationDays, 10) || 14)),
        protocol: protocol.trim(),
        metrics: metrics.split(",").map((m) => m.trim()).filter(Boolean),
        baselineNote: baselineNote.trim(),
        startedOn: null,
        reflection: null,
      });
      onDone(created);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader eyebrow="New experiment" title="Design a small, safe test" />
      <SafetyBanner>
        Experiments are educational self-tracking around lifestyle habits — sleep, movement, nutrition, stress. Never a medical intervention. For anything clinical, talk to a professional first.
      </SafetyBanner>

      <div className="mt-5 space-y-5">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Consistent wake time" className="mt-1.5" />
        </div>
        <div>
          <Label>Goal</Label>
          <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What do you want to observe?" className="mt-1.5" />
        </div>
        <div>
          <Label>Domain</Label>
          <div className="mt-1.5">
            <OptionGrid columns={3} options={["MOVE", "THINK", "RESTORE", "FUEL", "CONNECT", "MEASURE"].map((d) => ({ value: d, label: d }))} value={domain} onChange={setDomain} />
          </div>
        </div>
        <div>
          <Label>Duration (days)</Label>
          <Input type="number" min={3} max={90} value={durationDays} onChange={(e) => setDuration(e.target.value)} className="mt-1.5 w-32" />
        </div>
        <div>
          <Label>Protocol</Label>
          <Textarea value={protocol} onChange={(e) => setProtocol(e.target.value)} placeholder="Exactly what you'll do each day…" className="mt-1.5" />
        </div>
        <div>
          <Label>Metrics (comma-separated)</Label>
          <Input value={metrics} onChange={(e) => setMetrics(e.target.value)} placeholder="sleep quality 1–5, morning energy 1–5" className="mt-1.5" />
        </div>
        <div>
          <Label>Baseline note (optional)</Label>
          <Textarea value={baselineNote} onChange={(e) => setBaselineNote(e.target.value)} placeholder="Where you're starting from — a 3-day average works well" className="mt-1.5" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button disabled={!canSave || saving} onClick={submit}>{saving ? "Creating…" : "Create draft"}</Button>
        </div>
      </div>
    </main>
    </AppShell>
  );
}

function ExperimentDetail({ experiment: e, onBack, onChanged }: { experiment: Experiment; onBack: () => void; onChanged: () => void }) {
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");
  const [reflection, setReflection] = useState("");
  const nextDay = Math.min(e.checkins.length + 1, e.durationDays);
  const avg = e.checkins.length ? (e.checkins.reduce((s, c) => s + c.rating, 0) / e.checkins.length).toFixed(1) : null;

  const start = async () => { await getDataProvider().startExperiment(e.id); onChanged(); };
  const checkin = async () => {
    await getDataProvider().addCheckin(e.id, { day: nextDay, rating, note });
    setNote("");
    onChanged();
  };
  const complete = async () => {
    await getDataProvider().completeExperiment(e.id, reflection.trim() || "Completed.");
    onChanged();
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <Button variant="ghost" size="sm" onClick={onBack}>← All experiments</Button>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{e.title}</h1>
          <p className="mt-1 text-sm text-ink-faint">{e.goal}</p>
        </div>
        <Badge variant={e.status === "active" ? "default" : e.status === "completed" ? "gold" : "muted"}>{e.status}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{e.domain}</Badge>
        <Badge variant="outline">{e.durationDays} days</Badge>
        {e.metrics.map((m) => <Badge key={m} variant="muted">{m}</Badge>)}
      </div>

      <Card className="mt-5">
        <CardContent className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Protocol</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.protocol}</p>
          {e.baselineNote ? (
            <>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Baseline (self-reported)</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.baselineNote}</p>
            </>
          ) : null}
        </CardContent>
      </Card>

      {e.status === "draft" ? (
        <div className="mt-5 flex justify-end">
          <Button onClick={start}>Start experiment</Button>
        </div>
      ) : null}

      {e.status === "active" ? (
        <Card className="mt-5">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Daily check-in · day {nextDay}</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={cn("h-11 flex-1 rounded-xl border text-sm font-medium", rating === n ? "border-sage-600 bg-sage-600 text-paper" : "border-sage-200 bg-white/70 text-ink-soft")}
                >
                  {n}
                </button>
              ))}
            </div>
            <Textarea value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Optional note…" className="mt-3 min-h-[60px]" />
            <div className="mt-3 flex justify-end">
              <Button onClick={checkin}>Log check-in</Button>
            </div>
            <p className="mt-3 text-[11px] text-ink-faint">
              {e.checkins.length}/{e.durationDays} logged{avg ? ` · average rating ${avg}/5` : ""} — consistency, not judgment.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {e.checkins.length > 0 ? (
        <section className="mt-5">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Check-in history</h2>
          <div className="space-y-2">
            {[...e.checkins].reverse().map((c) => (
              <div key={c.day} className="flex items-start gap-3 rounded-xl border border-sage-100 bg-white/60 p-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-[11px] font-bold text-sage-700">{c.day}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-soft">Rating {c.rating}/5</p>
                  {c.note ? <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">{c.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {e.status === "active" ? (
        <Card className="mt-5">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">Finish & reflect</p>
            <Textarea value={reflection} onChange={(ev) => setReflection(ev.target.value)} placeholder="What did you observe? Keep / adjust / stop?" className="mt-3" />
            <div className="mt-3 flex justify-end">
              <Button variant="gold" disabled={e.checkins.length === 0} onClick={complete}>Complete experiment</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {e.status === "completed" && e.reflection ? (
        <Card className="mt-5 border-gold-300/50 bg-gold-50/50">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700">Reflection</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.reflection}</p>
          </CardContent>
        </Card>
      ) : null}
    </main>
    </AppShell>
  );
}

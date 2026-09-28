"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, HeroCard } from "@/components/ui/card";
import { AppShell } from "@/components/app-shell";
import { Icon, IconTile, LabelledText, ProgressRing } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import type { Experiment, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Insight {
  text: string;
  source: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkinFor, setCheckinFor] = useState<Experiment | null>(null);
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      const dp = getDataProvider();
      const s = await dp.getSession();
      if (!s) await dp.signInDemo();
      const prof = await dp.getProfile();
      const exps = await dp.getExperiments();
      setProfile(prof);
      setExperiments(exps);
      setInsights(
        exps
          .filter((e) => e.status === "completed" && e.reflection)
          .map((e) => ({ text: e.reflection as string, source: `Reflection · ${e.title}` }))
          .slice(0, 2)
      );
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <main className="mx-auto max-w-2xl px-5 py-10 text-sm text-ink-faint">Loading your dashboard…</main>
      </AppShell>
    );
  }

  const active = experiments.filter((e) => e.status === "active");
  const today = new Date().toISOString().slice(0, 10);
  const nextCheckin = active.find((e) => !e.checkins.some((c) => c.createdAt.slice(0, 10) === today)) ?? active[0] ?? null;
  const doneTodayCount = active.filter((e) => e.checkins.some((c) => c.createdAt.slice(0, 10) === today)).length;
  const todayProgress = active.length === 0 ? 0 : doneTodayCount / active.length;
  const totalCheckins = active.reduce((s, e) => s + e.checkins.length, 0);
  const weakestDomain = Object.entries(profile?.domainBaselines ?? {}).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "RESTORE";
  const priorities = buildPriorities(nextCheckin, active.length, weakestDomain);

  const submitCheckin = async () => {
    if (!checkinFor) return;
    const day = Math.min(checkinFor.checkins.length + 1, checkinFor.durationDays);
    await getDataProvider().addCheckin(checkinFor.id, { day, rating, note });
    setExperiments(await getDataProvider().getExperiments());
    setCheckinFor(null);
    setNote("");
  };

  const consistency = (e: Experiment): number => {
    if (!e.startedOn) return 0;
    const start = new Date(e.startedOn).getTime();
    const daysActive = Math.max(1, Math.round((Date.now() - start) / 86400000));
    return Math.min(100, Math.round((e.checkins.length / daysActive) * 100));
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pt-6">
        {/* Greeting */}
        <div className="reveal reveal-1 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage-600">
              {new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink">
              Good {greeting()}, {profile?.displayName ?? "friend"}
            </h1>
          </div>
          {totalCheckins > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-gold-300/50 bg-gold-50 px-3 py-1.5 text-[11px] font-bold text-gold-700">
              <Icon name="check-circle" className="h-3.5 w-3.5" />
              <span className="tnum">{totalCheckins}</span> logged
            </div>
          ) : null}
        </div>

        {/* Today hero (deep surface + ring) */}
        <HeroCard className="reveal reveal-2 mt-5 p-5">
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/8 blur-2xl" />
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">Today</p>
              {nextCheckin ? (
                <>
                  <p className="mt-1.5 font-display text-[21px] font-extrabold leading-snug">
                    {doneTodayCount === active.length ? "All check-ins done" : nextCheckin.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-paper/70">
                    {doneTodayCount === active.length
                      ? "Consistency is the point — nicely held."
                      : `One minute: rate ${nextCheckin.metrics[0]} for today.`}
                  </p>
                  <Button variant="light" size="sm" className="mt-4" onClick={() => setCheckinFor(nextCheckin)}>
                    {doneTodayCount === active.length ? "Add another check-in" : "Daily check-in"}
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-1.5 font-display text-[21px] font-extrabold leading-snug">Start your first experiment</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-paper/70">
                    Small, safe, time-boxed — the Evidence way.
                  </p>
                  <Link href="/experiments">
                    <Button variant="light" size="sm" className="mt-4">
                      Browse templates
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="hidden shrink-0 sm:block">
              <ProgressRing
                value={todayProgress}
                tone="paper"
                size={104}
                stroke={9}
                label={`${Math.round(todayProgress * 100)}%`}
                sublabel="today"
              />
            </div>
          </div>
        </HeroCard>

        {/* Priorities */}
        <section className="reveal reveal-3 mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">Priorities</h2>
          </div>
          <div className="space-y-2.5">
            {priorities.map((p) => (
              <Card key={p.text} className="flex items-center gap-3.5 p-4">
                <IconTile tone={p.tone}>
                  <Icon name={p.icon} />
                </IconTile>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{p.text}</p>
                  {p.sub ? <p className="mt-0.5 text-xs leading-snug text-ink-faint">{p.sub}</p> : null}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Current experiments */}
        <section className="reveal reveal-3 mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">Experiments</h2>
            <Link href="/experiments" className="text-xs font-bold text-sage-700 transition-colors hover:text-sage-600">
              All →
            </Link>
          </div>
          {active.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-3 p-5 text-sm text-ink-faint">
                No active experiments yet.
                <Link href="/experiments">
                  <Button size="sm" variant="outline">Start one</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {active.map((e) => {
                const doneToday = e.checkins.some((c) => c.createdAt.slice(0, 10) === today);
                const pct = Math.min(100, Math.round((e.checkins.length / e.durationDays) * 100));
                return (
                  <Card key={e.id} className="p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-[15px] font-bold text-ink">{e.title}</p>
                        <p className="mt-0.5 text-xs text-ink-faint">
                          Day {Math.min(e.checkins.length + 1, e.durationDays)} of {e.durationDays} · {e.metrics[0]}
                        </p>
                      </div>
                      <Badge variant={doneToday ? "default" : "gold"}>{doneToday ? "Checked in" : "Due"}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="tnum text-[11px] font-bold text-ink-faint">{pct}%</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-ink-faint">Consistency ~{consistency(e)}%</span>
                      <Button size="sm" variant={doneToday ? "outline" : "primary"} onClick={() => setCheckinFor(e)}>
                        {doneToday ? "Log again" : "Check in"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent insights */}
        <section className="reveal reveal-4 mt-7">
          <h2 className="mb-3 font-display text-lg font-extrabold tracking-tight text-ink">Recent insights</h2>
          {insights.length === 0 ? (
            <Card>
              <CardContent className="p-5 text-sm leading-relaxed text-ink-faint">
                Complete an experiment and your reflection lands here. Meanwhile, ask Longevity AI{" "}
                <Link href="/ai" className="font-semibold text-sage-700 underline underline-offset-2">
                  what to focus on first
                </Link>
                .
              </CardContent>
            </Card>
          ) : (
            insights.map((i) => (
              <Card key={i.text.slice(0, 24)} className="mb-3 p-4">
                <LabelledText text={i.text} />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">{i.source}</p>
              </Card>
            ))
          )}
        </section>

        {/* Circle activity */}
        <section className="reveal reveal-4 mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">Circle activity</h2>
            <Link href="/community" className="text-xs font-bold text-sage-700 transition-colors hover:text-sage-600">
              Open →
            </Link>
          </div>
          <div className="rail flex gap-3 overflow-x-auto pb-1">
            {[
              ["sleep", "moon", "Wei M. kept a 14-day caffeine cut-off and rated sleep 4/5"],
              ["strength", "flask", "Ravi K. shared a 40-minute 2×/week full-body pattern"],
              ["mind", "spark", "Aisha N. finished 24/30 days of 8-minute sits"],
            ].map(([circle, icon, text]) => (
              <Card key={circle} className="w-64 shrink-0 p-4">
                <div className="flex items-center justify-between">
                  <Badge>{circle}</Badge>
                  <IconTile tone="sage" className="h-7 w-7 rounded-lg">
                    <Icon name={icon as "moon"} className="h-3.5 w-3.5" />
                  </IconTile>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section className="reveal reveal-4 mt-7 grid grid-cols-2 gap-3 pb-4">
          {[
            ["/vault", "Health Data Vault", "upload"],
            ["/community", "Community", "users"],
            ["/reports", "Monthly Reports", "chart"],
            ["/settings", "Settings & Privacy", "settings"],
          ].map(([href, title, icon]) => (
            <Link key={href} href={href}>
              <Card className="flex h-full items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                <IconTile tone="gold">
                  <Icon name={icon as "upload"} />
                </IconTile>
                <div>
                  <p className="font-display text-[13px] font-bold text-ink">{title}</p>
                </div>
              </Card>
            </Link>
          ))}
        </section>

        {/* Check-in sheet */}
        {checkinFor ? (
          <div className="fixed inset-0 z-50 flex items-end bg-ink/45 backdrop-blur-sm" onClick={() => setCheckinFor(null)}>
            <div
              className="animate-scale-in mx-auto w-full max-w-2xl rounded-t-3xl bg-paper p-6 pb-10 shadow-lift"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-mist" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-600">Daily check-in</p>
              <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">{checkinFor.title}</h3>
              <p className="mt-1 text-xs text-ink-faint">Rate {checkinFor.metrics[0]} for today (educational self-tracking)</p>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`Rating ${n}`}
                    className={cn(
                      "tnum h-12 flex-1 rounded-xl border font-display text-base font-extrabold transition-all active:scale-95",
                      rating === n
                        ? "border-sage-700 bg-sage-700 text-paper shadow-glow"
                        : "border-sage-200 bg-white/70 text-ink-soft hover:border-sage-400"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note — what did you notice?"
                className="mt-4 min-h-[72px] w-full rounded-xl border border-sage-200 bg-white/85 p-3 text-sm placeholder:text-ink-faint/50 focus:border-sage-400 focus:outline-none focus:ring-4 focus:ring-sage-500/15"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setCheckinFor(null)}>Cancel</Button>
                <Button onClick={submitCheckin}>Save check-in</Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}

function buildPriorities(
  dueExp: Experiment | null,
  activeCount: number,
  weakestDomain: string
): { icon: "check-circle" | "flask" | "target" | "moon" | "sun" | "spark" | "users"; text: string; sub?: string; tone: "sage" | "gold" | "clay" | "deep" }[] {
  const out: { icon: "check-circle" | "flask" | "target" | "moon" | "sun" | "spark" | "users"; text: string; sub?: string; tone: "sage" | "gold" | "clay" | "deep" }[] = [];
  if (dueExp) {
    out.push({ icon: "check-circle", text: `Check in on “${dueExp.title}”`, sub: "A 1-minute rating keeps your trend honest", tone: "gold" });
  } else if (activeCount > 0) {
    out.push({ icon: "check-circle", text: "All experiments checked in today", sub: "Nice — consistency is the point", tone: "sage" });
  } else {
    out.push({ icon: "flask", text: "Start your first experiment", sub: "Browse templates in the Labs hub", tone: "gold" });
  }

  const domainCopy: Record<string, string> = {
    MOVE: "a 10-minute walk after your largest meal",
    THINK: "8 minutes of quiet focus practice",
    RESTORE: "a consistent wind-down buffer tonight",
    FUEL: "a protein-forward breakfast",
    CONNECT: "one message to someone who matters",
    MEASURE: "a 1-minute review of what you're tracking",
  };
  const domainIcon: Record<string, "target" | "moon" | "sun" | "spark" | "users"> = {
    MOVE: "sun",
    THINK: "spark",
    RESTORE: "moon",
    FUEL: "target",
    CONNECT: "users",
    MEASURE: "target",
  };
  out.push({
    icon: domainIcon[weakestDomain] ?? "target",
    text: `Nudge for ${weakestDomain.toLowerCase()}: try ${domainCopy[weakestDomain] ?? "one small keystone action"}`,
    sub: `Based on your self-reported ${weakestDomain} baseline (educational, not medical)`,
    tone: "sage",
  });
  return out;
}

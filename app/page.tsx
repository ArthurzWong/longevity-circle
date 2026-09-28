import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/shared";
import { ICON_PATHS, Icon } from "@/components/shared";

export default function LandingPage() {
  return (
    <main className="atmosphere relative min-h-[100dvh] overflow-hidden">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-700 text-paper shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} aria-hidden>
              {ICON_PATHS.leaf}
            </svg>
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Longevity<span className="text-sage-600"> Circle</span>
          </span>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink-soft md:flex">
          <a href="#loop" className="transition-colors hover:text-sage-700">The loop</a>
          <a href="#evidence" className="transition-colors hover:text-sage-700">Evidence</a>
          <a href="#promise" className="transition-colors hover:text-sage-700">Our promise</a>
        </nav>
        <Link href="/onboarding">
          <Button size="md" variant="primary">Get started</Button>
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto grid w-full max-w-5xl gap-12 px-6 pb-20 pt-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-16">
        <div className="grain relative">
          <p className="reveal reveal-1 inline-flex items-center gap-1.5 rounded-full border border-sage-300/60 bg-white/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage-700 backdrop-blur-sm">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Evidence-aware · education only
          </p>
          <h1 className="reveal reveal-2 mt-5 font-display text-[42px] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink sm:text-[56px] md:text-[64px]">
            Live Better.
            <br />
            <span className="text-vital">Stay Capable.</span>
            <br />
            Keep Evolving.
          </h1>
          <p className="reveal reveal-3 mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-soft">
            Longevity education turned into personal action: learn what the evidence
            says, run small experiments, and track what actually changes.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto">Create My Longevity Profile</Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Longevity</Button>
            </Link>
          </div>
          <p className="reveal reveal-4 mt-5 text-xs leading-relaxed text-ink-faint">
            Educational wellness tool. No biological-age gimmicks, no prescriptions, no fear.
          </p>
        </div>

        {/* Real component preview — actual app cards, lightly composed */}
        <div className="reveal reveal-3 relative mx-auto w-full max-w-[400px]" aria-hidden>
          <div className="absolute -left-6 -top-8 h-40 w-40 rounded-full bg-sage-300/30 blur-2xl" />
          <div className="absolute -bottom-10 -right-4 h-44 w-44 rounded-full bg-gold-300/30 blur-2xl" />

          {/* Today focus card (deep) */}
          <div className="surface-deep animate-float-slow relative rounded-3xl p-5 text-paper shadow-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-paper/60">Today&rsquo;s focus</p>
                <p className="mt-1 font-display text-lg font-bold leading-snug">Protect the wind-down</p>
                <p className="mt-1 text-xs text-paper/70">30 minutes before bed, screens away.</p>
              </div>
              <ProgressRing value={0.6} tone="paper" size={76} label="6/14" sublabel="days" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold text-paper backdrop-blur-sm">
                Caffeine cut-off · day 6
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold text-paper backdrop-blur-sm">
                Sleep 4.6/5
              </span>
            </div>
          </div>

          {/* Evidence card (paper) */}
          <div className="relative z-10 -mt-6 ml-6 mr-[-14px] rounded-2xl border border-sage-200/60 bg-white/85 p-4 shadow-lift backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage-600">Evidence brief</p>
              <span className="rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-bold text-sage-700">Strong</span>
            </div>
            <p className="mt-2 text-[13px] font-semibold leading-snug text-ink">
              Does strength training extend healthspan?
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-faint">
              30&ndash;60 min/week of muscle-strengthening activity is associated with
              meaningfully lower all-cause mortality.
            </p>
          </div>

          {/* Streak chip (gold) */}
          <div className="relative z-20 -mt-4 ml-[-10px] flex w-fit items-center gap-2.5 rounded-2xl border border-gold-300/50 bg-gold-50/95 px-4 py-3 shadow-lift backdrop-blur-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <Icon name="check-circle" />
            </span>
            <div>
              <p className="tnum font-display text-base font-extrabold leading-none text-ink">11 / 14</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-700">check-ins logged</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The loop ────────────────────────────────────────── */}
      <section id="loop" className="relative border-t border-sage-200/50 bg-white/40 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-md font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
            One loop, six movements
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-faint">
            Not a feed, not a score. A rhythm you own: learn, assess, experiment,
            track, reflect, and connect.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["LEARN", "Evidence, sourced and graded", "book"],
              ["ASSESS", "Your self-reported baseline", "chart"],
              ["EXPERIMENT", "Small, safe, time-boxed", "flask"],
              ["TRACK", "Check-ins, not judgments", "check-circle"],
              ["REFLECT", "AI-assisted, human-owned", "spark"],
              ["CONNECT", "Experts & circles", "users"],
            ].map(([k, v, icon], i) => (
              <div
                key={k}
                className="group flex items-start gap-3.5 rounded-2xl border border-sage-200/50 bg-white/70 p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700 transition-colors group-hover:bg-sage-700 group-hover:text-paper">
                  <Icon name={icon as "book"} />
                </span>
                <div>
                  <p className="text-xs font-extrabold tracking-[0.14em] text-sage-700">{k}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{v}</p>
                </div>
                <span className="tnum ml-auto text-[11px] font-bold text-sage-300">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Evidence strip ──────────────────────────────────── */}
      <section id="evidence" className="relative px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <h2 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
              Sources first. Hype last.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-faint">
              Every brief links real, public research and names what remains
              uncertain. The AI labels each claim as fact, research finding,
              expert opinion, your data, or uncertainty.
            </p>
            <ul className="mt-6 space-y-3">
              {["WHO guidance and peer-reviewed meta-analyses", "Evidence strength shown, never overstated", "Citations you can open and check yourself"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            {[
              ["Does fasting improve longevity?", "Mixed evidence", "warn"],
              ["How many steps a day are associated with lower mortality?", "Strong evidence", "default"],
              ["Do multivitamins extend lifespan?", "Insufficient evidence", "gold"],
            ].map(([q, verdict, tone]) => (
              <div
                key={q}
                className="flex items-center justify-between gap-4 rounded-2xl border border-sage-200/50 bg-white/75 p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <p className="font-display text-[15px] font-bold leading-snug text-ink">{q}</p>
                <span
                  className={
                    tone === "warn"
                      ? "shrink-0 rounded-full border border-clay-500/40 bg-clay-100 px-2.5 py-1 text-[10px] font-bold text-clay-600"
                      : tone === "gold"
                        ? "shrink-0 rounded-full border border-gold-300/60 bg-gold-50 px-2.5 py-1 text-[10px] font-bold text-gold-700"
                        : "shrink-0 rounded-full border border-sage-200 bg-sage-50 px-2.5 py-1 text-[10px] font-bold text-sage-700"
                  }
                >
                  {verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promise ─────────────────────────────────────────── */}
      <section id="promise" className="relative px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-sage-200/50 bg-white/75 p-7 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
              <Icon name="leaf" className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-ink">What this is</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
              <li>Evidence briefs with real sources and honest uncertainty</li>
              <li>Self-experiments with daily check-ins</li>
              <li>Health documents you review and confirm yourself</li>
              <li>A community that keeps discussion educational</li>
            </ul>
          </div>
          <div className="surface-deep relative overflow-hidden rounded-3xl p-7 text-paper shadow-lift">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-paper">
              <Icon name="shield" className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">What this is not</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-paper/85">
              <li>A diagnosis, treatment, or prescription tool</li>
              <li>A &ldquo;biological age&rdquo; score, ever</li>
              <li>A lifespan prediction</li>
              <li>A replacement for your doctor</li>
            </ul>
            <div className="mt-7">
              <Link href="/onboarding">
                <Button size="lg" variant="light">Create My Longevity Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-sage-200/50 px-6 py-10 text-center text-[11px] leading-relaxed text-ink-faint/80">
        Longevity Circle · Educational demo build · All expert content is fictional and labelled DEMO
      </footer>
    </main>
  );
}

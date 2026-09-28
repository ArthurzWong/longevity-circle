"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionGrid } from "@/components/ui/input";
import { SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import type { DomainKey, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["About you", "Goals", "Lifestyle", "Interests", "Baseline", "Consent"];

const AGE_RANGES = ["25–34", "35–44", "45–54", "55–64", "65+"];
const SEX_OPTIONS = ["female", "male", "other", "prefer not to say"];
const ACTIVITY = [
  { value: "sedentary", label: "Mostly seated", hint: "little planned movement" },
  { value: "lightly active", label: "Lightly active", hint: "some walking, occasional exercise" },
  { value: "active", label: "Active", hint: "exercise 2–4×/week" },
  { value: "very active", label: "Very active", hint: "training most days" },
];
const SLEEP = ["Under 6h", "6–7h", "7–8h", "8h+", "irregular timing"];
const NUTRITION = ["omnivore", "vegetarian", "vegan", "pescatarian", "low-carb", "no particular pattern"];
const STRESS = ["low", "manageable", "moderate", "high"];
const INTERESTS = ["sleep", "strength", "nutrition", "fasting", "mobility", "stress & mind", "connection", "biomarkers", "wearables", "longevity science"];
const WEARABLES = ["none", "smartwatch", "ring", "continuous glucose monitor", "sleep tracker", "other"];

const DOMAINS: { key: DomainKey; label: string; q: string }[] = [
  { key: "MOVE", label: "Move", q: "How is your movement & strength?" },
  { key: "THINK", label: "Think", q: "How is your focus & cognitive challenge?" },
  { key: "RESTORE", label: "Restore", q: "How is your sleep & recovery?" },
  { key: "FUEL", label: "Fuel", q: "How is your nutrition?" },
  { key: "CONNECT", label: "Connect", q: "How are your relationships & purpose?" },
  { key: "MEASURE", label: "Measure", q: "How consistent is your tracking?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<Profile>>({ preferredLanguage: "en" });
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState<Profile | null>(null);

  useEffect(() => {
    getDataProvider().getProfile().then((p) => {
      if (p) {
        setExisting(p);
        setProfile((cur) => ({ ...p, ...cur }));
      }
    });
  }, []);
  const set = (patch: Partial<Profile>) => setProfile((cur) => ({ ...cur, ...patch }));
  const single = (key: keyof Profile): string[] => {
    const v = profile[key];
    return typeof v === "string" && v ? [v] : [];
  };
  const pickSingle = (key: keyof Profile, v: string[]) => set({ [key]: v[0] ?? "" } as Partial<Profile>);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return Boolean(profile.ageRange && profile.sex);
      case 1: return (profile.goals ?? []).length > 0;
      case 2: return Boolean(profile.activityLevel && profile.sleepPattern);
      case 3: return (profile.wellnessInterests ?? []).length > 0;
      case 4: return Object.keys(profile.domainBaselines ?? {}).length === 6;
      case 5: return consent;
      default: return false;
    }
  };
  const finish = async () => {
    setSaving(true);
    try {
      await getDataProvider().saveOnboarding(profile);
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10">
      {/* progress */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-600">Onboarding</p>
        <div className="mt-3 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-sage-600" : "bg-mist")} />
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
      </div>

      {step === 0 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">About you</h1>
          <p className="-mt-3 text-sm text-ink-faint">
            We collect the minimum needed to personalise education. No conditions, medications, or diagnoses.
          </p>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Age range</p>
            <OptionGrid columns={3} options={AGE_RANGES.map((a) => ({ value: a, label: a }))} value={single("ageRange")} onChange={(v) => pickSingle("ageRange", v)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Sex</p>
            <OptionGrid columns={2} options={SEX_OPTIONS.map((a) => ({ value: a, label: a }))} value={single("sex")} onChange={(v) => pickSingle("sex", v)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Preferred language</p>
            <OptionGrid columns={2} options={[{ value: "en", label: "English" }, { value: "ms", label: "Bahasa Malaysia" }, { value: "zh", label: "中文" }, { value: "ta", label: "தமிழ்" }]} value={single("preferredLanguage")} onChange={(v) => pickSingle("preferredLanguage", v)} />
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">What are you here for?</h1>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Pick your goals (any number)</p>
            <OptionGrid
              multi
              options={[
                "Sleep consistently", "Build strength", "Move more daily", "Eat better",
                "Reduce stress", "Stay connected", "Understand my data", "Keep exploring",
              ].map((g) => ({ value: g, label: g }))}
              value={profile.goals ?? []}
              onChange={(v) => set({ goals: v })}
            />
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Your current lifestyle</h1>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Activity level</p>
            <OptionGrid options={ACTIVITY} value={single("activityLevel")} onChange={(v) => pickSingle("activityLevel", v)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Sleep pattern</p>
            <OptionGrid columns={3} options={SLEEP.map((a) => ({ value: a, label: a }))} value={single("sleepPattern")} onChange={(v) => pickSingle("sleepPattern", v)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Nutrition style</p>
            <OptionGrid columns={2} options={NUTRITION.map((a) => ({ value: a, label: a }))} value={single("nutritionStyle")} onChange={(v) => pickSingle("nutritionStyle", v)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Usual stress level</p>
            <OptionGrid columns={3} options={STRESS.map((a) => ({ value: a, label: a }))} value={single("stressLevel")} onChange={(v) => pickSingle("stressLevel", v)} />
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Interests & devices</h1>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Wellness interests</p>
            <OptionGrid multi columns={2} options={INTERESTS.map((a) => ({ value: a, label: a }))} value={profile.wellnessInterests ?? []} onChange={(v) => set({ wellnessInterests: v })} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Wearables (optional)</p>
            <OptionGrid multi columns={2} options={WEARABLES.map((a) => ({ value: a, label: a }))} value={profile.wearables ?? []} onChange={(v) => set({ wearables: v })} />
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Your baseline</h1>
          <SafetyBanner>
            Personal baseline — not a medical assessment. You rate yourself 1–5 across six domains; this frames your education and experiments.
          </SafetyBanner>
          {DOMAINS.map((d) => (
            <div key={d.key}>
              <p className="mb-2 text-sm font-medium text-ink-soft">
                {d.label} <span className="font-normal text-ink-faint">· {d.q}</span>
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const current = profile.domainBaselines?.[d.key];
                  const active = current === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        set({ domainBaselines: { ...(profile.domainBaselines ?? {}), [d.key]: n } })
                      }
                      className={cn(
                        "h-11 flex-1 rounded-xl border text-sm font-medium transition-all",
                        active
                          ? "border-sage-600 bg-sage-600 text-paper"
                          : "border-sage-200 bg-white/70 text-ink-soft hover:border-sage-400"
                      )}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {step === 5 && (
        <section className="space-y-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Privacy & consent</h1>
          <div className="rounded-2xl border border-sage-200/70 bg-white/70 p-5 text-sm leading-relaxed text-ink-soft">
            <p className="font-medium text-ink">What we collect</p>
            <p className="mt-1.5">Only what you entered in the previous steps — self-reported lifestyle info and 1–5 baseline ratings.</p>
            <p className="mt-3 font-medium text-ink">How it&apos;s used</p>
            <p className="mt-1.5">To personalise educational content and experiments. Your profile is private by default.</p>
            <p className="mt-3 font-medium text-ink">Your controls</p>
            <p className="mt-1.5">Export all your data or delete everything, any time, from Settings. Health documents you upload are only added to your dataset after you confirm the extraction.</p>
            <p className="mt-3 font-medium text-ink">What this is not</p>
            <p className="mt-1.5">This is educational software. It does not diagnose, treat, or replace professional care.</p>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sage-200 bg-white/70 p-4">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#3D6650]"
            />
            <span className="text-sm leading-relaxed text-ink-soft">
              I understand this is an educational wellness tool, not medical care, and I consent to my self-reported data being stored to personalise my experience.
            </span>
          </label>
          {existing?.onboarded ? (
            <p className="text-xs text-ink-faint">You&apos;ve completed onboarding before — continuing will update your profile.</p>
          ) : null}
        </section>
      )}

      {/* nav */}
      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={() => (step === 0 ? router.push("/") : setStep(step - 1))}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canNext()} onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button disabled={!canNext() || saving} onClick={finish}>
            {saving ? "Saving…" : "Create My Profile"}
          </Button>
        )}
      </div>
    </main>
  );
}

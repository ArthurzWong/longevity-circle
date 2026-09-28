"use client";

import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import { BASELINE_LABEL, WELLNESS_INDICATOR_LABEL } from "@/lib/safety/guardrails";
import type { DomainKey, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOMAINS: { key: DomainKey; label: string; desc: string }[] = [
  { key: "MOVE", label: "Move", desc: "Strength, mobility, daily movement" },
  { key: "THINK", label: "Think", desc: "Cognitive challenge & focus" },
  { key: "RESTORE", label: "Restore", desc: "Sleep & recovery" },
  { key: "FUEL", label: "Fuel", desc: "Nutrition & hydration" },
  { key: "CONNECT", label: "Connect", desc: "Relationships & purpose" },
  { key: "MEASURE", label: "Measure", desc: "Tracking & awareness" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Record<DomainKey, number>>>({});

  useEffect(() => {
    getDataProvider().getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return <main className="mx-auto max-w-2xl px-5 py-10 text-sm text-ink-faint">Loading profile…</main>;
  }

  const saveBaselines = async () => {
    await getDataProvider().updateProfile({ domainBaselines: { ...profile.domainBaselines, ...draft } });
    setProfile({ ...profile, domainBaselines: { ...profile.domainBaselines, ...draft } });
    setEditing(false);
    setDraft({});
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Longevity Profile"
        title={profile.displayName || "Member"}
        subtitle={[
          [profile.ageRange, profile.sex].filter(Boolean).join(" · "),
          profile.activityLevel,
          profile.sleepPattern ? `Sleep: ${profile.sleepPattern}` : null,
          profile.nutritionStyle,
        ].filter(Boolean).join("  ·  ")}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="muted">{profile.preferredLanguage === "en" ? "English" : profile.preferredLanguage}</Badge>
        {(profile.wellnessInterests ?? []).slice(0, 4).map((i) => (
          <Badge key={i}>{i}</Badge>
        ))}
        {(profile.wearables ?? []).filter((w) => w !== "none").map((w) => (
          <Badge key={w} variant="outline">{w}</Badge>
        ))}
        <Badge variant={profile.profileVisibility === "private" ? "default" : "gold"}>
          {profile.profileVisibility === "private" ? "Private profile" : "Visible in circles"}
        </Badge>
      </div>

      {profile.goals?.length ? (
        <Card className="mb-6">
          <CardHeader><CardTitle>Goals</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            {profile.goals.map((g) => <Badge key={g} variant="gold">{g}</Badge>)}
          </CardContent>
        </Card>
      ) : null}

      <section className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Six domains</h2>
          <Button variant={editing ? "primary" : "outline"} size="sm" onClick={() => (editing ? saveBaselines() : setEditing(true))}>
            {editing ? "Save ratings" : "Update ratings"}
          </Button>
        </div>
        <SafetyBanner>{BASELINE_LABEL}</SafetyBanner>
        <div className="mt-4 space-y-3">
          {DOMAINS.map((d) => {
            const value = (editing ? draft[d.key] ?? profile.domainBaselines?.[d.key] : profile.domainBaselines?.[d.key]) ?? 0;
            return (
              <Card key={d.key}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-24 shrink-0">
                    <p className="font-display text-sm font-semibold text-ink">{d.label}</p>
                    <p className="text-[11px] leading-tight text-ink-faint">{d.desc}</p>
                  </div>
                  <div className="flex flex-1 gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = value >= n && value > 0;
                      return (
                        <button
                          key={n}
                          type="button"
                          disabled={!editing}
                          onClick={() => setDraft((cur) => ({ ...cur, [d.key]: n }))}
                          className={cn(
                            "h-8 flex-1 rounded-lg border text-xs transition-all",
                            active ? "border-sage-600 bg-sage-600/90 text-paper" : "border-sage-200 bg-white/60 text-ink-faint",
                            editing && !active && "hover:border-sage-400"
                          )}
                          aria-label={`${d.label} level ${n}`}
                        />
                      );
                    })}
                  </div>
                  <span className="w-7 text-right font-display text-sm font-semibold text-sage-700">{value > 0 ? `${value}/5` : "—"}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">{WELLNESS_INDICATOR_LABEL}</p>
      </section>

      {/* Secondary destinations */}
      <section className="mt-8 grid grid-cols-2 gap-3">
        {[
          ["/vault", "Health Data Vault", "Upload & confirm health documents"],
          ["/community", "Community", "Topic circles & discussion"],
          ["/reports", "Monthly Reports", "Reflections & trends"],
          ["/settings", "Settings & Privacy", "Export or delete your data"],
        ].map(([href, title, sub]) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-shadow hover:shadow-lift">
              <CardContent className="p-4">
                <p className="font-display text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs leading-snug text-ink-faint">{sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <AdminAndStudioLinks />
    </main>
    </AppShell>
  );
}

function AdminAndStudioLinks() {
  return (
    <section className="mt-4 grid grid-cols-2 gap-3">
      {[
        ["/studio", "Creator Studio", "Upload & structure expert content"],
        ["/admin", "Admin", "Manage users, content & safety"],
      ].map(([href, title, sub]) => (
        <Link key={href} href={href}>
          <Card className="h-full transition-shadow hover:shadow-lift">
            <CardContent className="p-4">
              <p className="font-display text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-snug text-ink-faint">{sub}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}

"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import type { Profile } from "@/lib/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    getDataProvider().getProfile().then(setProfile);
  }, []);

  const toggleVisibility = async () => {
    if (!profile) return;
    const next = profile.profileVisibility === "private" ? "circle" : "private";
    const updated = await getDataProvider().updateProfile({ profileVisibility: next });
    setProfile(updated);
  };

  const exportData = async () => {
    const json = await getDataProvider().exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `longevity-circle-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAll = async () => {
    await getDataProvider().deleteAllData();
    setDeleted(true);
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Settings & Privacy"
        title="Your data, your controls"
        subtitle="Minimum collection, private by default, export or delete any time."
      />

      <section className="mb-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Privacy status</h2>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Profile visibility</p>
                <p className="mt-0.5 text-xs text-ink-faint">Private profiles never appear to other members.</p>
              </div>
              <Badge variant={profile?.profileVisibility === "private" ? "default" : "gold"}>
                {profile?.profileVisibility === "private" ? "Private" : "Circle-visible"}
              </Badge>
            </div>
            <Button size="sm" variant="outline" className="mt-3" onClick={toggleVisibility}>
              Switch to {profile?.profileVisibility === "private" ? "circle-visible" : "private"}
            </Button>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] leading-snug text-ink-faint">
              <div className="rounded-lg bg-sage-50/80 p-2.5">✓ Minimum data collection</div>
              <div className="rounded-lg bg-sage-50/80 p-2.5">✓ Explicit consent on file {profile?.consentGivenAt ? `· ${profile.consentGivenAt.slice(0, 10)}` : ""}</div>
              <div className="rounded-lg bg-sage-50/80 p-2.5">✓ Role-based access & audit logs</div>
              <div className="rounded-lg bg-sage-50/80 p-2.5">✓ Encrypted storage where supported</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Data controls</h2>
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">Export my data</p>
                <p className="text-xs text-ink-faint">Download everything as JSON — profile, experiments, documents, confirmed measurements.</p>
              </div>
              <Button size="sm" variant="gold" onClick={exportData}>Export</Button>
            </div>
            <div className="border-t border-sage-100 pt-3">
              {!deleted ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-clay-600">Delete all my data</p>
                      <p className="text-xs text-ink-faint">Removes profile, experiments, documents, and posts from this device. Irreversible.</p>
                    </div>
                    <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
                  </div>
                  {confirmDelete ? (
                    <div className="mt-3 rounded-xl border border-clay-500/40 bg-clay-100/60 p-3.5">
                      <p className="text-xs leading-relaxed text-clay-600">Are you sure? This cannot be undone. (Demo mode clears local data; production also deletes server data and writes an audit log.)</p>
                      <div className="mt-2.5 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>Keep my data</Button>
                        <Button size="sm" variant="danger" onClick={deleteAll}>Yes, delete everything</Button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-ink-soft">All data deleted. Refresh to start fresh — onboarding will run again.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <SafetyBanner>
        Health data is sensitive. In production: Supabase Auth secures accounts, RLS limits every query to its owner, storage is encrypted at rest, and sensitive actions write to audit_logs.
      </SafetyBanner>
    </main>
    </AppShell>
  );
}

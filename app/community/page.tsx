"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { getDataProvider } from "@/lib/data/provider";
import { communityList } from "@/lib/data/demo-provider";
import { scanUserInput } from "@/lib/safety/guardrails";
import type { CommunityPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [justPosted, setJustPosted] = useState<CommunityPost | null>(null);

  const communities = communityList();
  const current = useMemo(() => communities.find((c) => c.slug === slug) ?? null, [communities, slug]);

  const load = async (s?: string | null) => {
    setPosts(await getDataProvider().getPosts(s ?? undefined));
  };

  useEffect(() => { load(slug); }, [slug]);

  const liveScan = composing ? scanUserInput(`${title}\n${body}`) : null;

  const submit = async () => {
    const post = await getDataProvider().createPost({ communitySlug: slug ?? "sleep", title: title.trim(), body: body.trim() });
    setJustPosted(post);
    setTitle("");
    setBody("");
    setComposing(false);
    await load(slug);
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Community"
        title="Learn together"
        subtitle="Educational discussion between members. Experiences, patterns, and questions — not diagnoses or prescriptions."
      />

      {/* Circle chips */}
      <div className="rail mb-5 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSlug(null)}
          className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium", !slug ? "border-sage-600 bg-sage-600 text-paper" : "border-sage-200 bg-white/70 text-ink-soft")}
        >
          All circles
        </button>
        {communities.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSlug(c.slug)}
            className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium", slug === c.slug ? "border-sage-600 bg-sage-600 text-paper" : "border-sage-200 bg-white/70 text-ink-soft")}
          >
            {c.name}
          </button>
        ))}
      </div>

      {current ? (
        <p className="mb-4 text-xs leading-relaxed text-ink-faint">{current.description}</p>
      ) : (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {communities.map((c) => (
            <button key={c.slug} onClick={() => setSlug(c.slug)} className="rounded-xl border border-sage-200 bg-white/60 p-3 text-left hover:border-sage-400">
              <p className="text-[13px] font-semibold text-ink">{c.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-faint">{c.description}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mb-5">
        <Button onClick={() => setComposing((c) => !c)}>{composing ? "Close composer" : "+ Share an observation"}</Button>
      </div>

      {composing ? (
        <Card className="mb-6">
          <CardContent className="space-y-4 p-5">
            <SafetyBanner>
              Keep it educational: share self-experiments, patterns, and questions. Posts asking for diagnosis, prescriptions, dosages, or emergency help are flagged and redirected to professional care.
            </SafetyBanner>
            <div>
              <Label>Circle</Label>
              <div className="mt-1.5">
                <select
                  value={slug ?? "sleep"}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-10 w-full rounded-xl border border-sage-200 bg-white/80 px-3 text-sm focus:border-sage-400 focus:outline-none"
                >
                  {communities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What did you observe or want to discuss?" className="mt-1.5" />
            </div>
            <div>
              <Label>Post</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share the pattern, the numbers, the experience…" className="mt-1.5" />
            </div>
            {liveScan?.flagged ? (
              <SafetyBanner tone="clay">
                This looks like a request for {liveScan.reason}. Posts can&apos;t provide medical advice — consider rephrasing educationally, and speak with a qualified professional for personal decisions.
              </SafetyBanner>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setComposing(false)}>Cancel</Button>
              <Button disabled={!title.trim() || !body.trim()} onClick={submit}>Post</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {justPosted?.status === "flagged" ? (
        <SafetyBanner tone="clay">
          Your post was held for review because it looked like a request for {justPosted.safetyFlag === "medical_request" ? "medical advice (diagnosis, prescription, or dosage)" : "unsafe content"}. A moderator will check it; meanwhile please consult a qualified professional for personal medical questions.
        </SafetyBanner>
      ) : null}

      <div className="space-y-3">
        {posts.filter((p) => p.status === "published" || p.id === justPosted?.id).map((p) => (
          <Card key={p.id} className={p.safetyFlag ? "border-clay-500/40" : undefined}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[15px] font-semibold leading-snug text-ink">{p.title}</p>
                  <p className="mt-1 text-[11px] text-ink-faint">{p.authorName} · {p.createdAt} · {communities.find((c) => c.slug === p.communitySlug)?.name ?? p.communitySlug}</p>
                </div>
                {p.status === "flagged" ? <Badge variant="warn">flagged · under review</Badge> : null}
              </div>
              <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{p.body}</p>
              {p.safetyFlag ? (
                <div className="mt-3">
                  <SafetyBanner tone="clay">
                    This post was automatically flagged for possible medical-advice requests. Longevity Circle keeps discussion educational — please consult a qualified professional for personal medical decisions.
                  </SafetyBanner>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
    </AppShell>
  );
}

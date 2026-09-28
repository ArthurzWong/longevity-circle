"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SafetyBanner } from "@/components/shared";
import { classifyValue, consultNudge } from "@/lib/safety/guardrails";
import { extractDocument } from "@/lib/data/demo-provider";
import { getDataProvider } from "@/lib/data/provider";
import type { ConfirmedMeasurement, HealthDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function VaultPage() {
  const [docs, setDocs] = useState<HealthDocument[]>([]);
  const [confirmed, setConfirmed] = useState<ConfirmedMeasurement[]>([]);
  const [busy, setBusy] = useState(false);
  const [reviewDoc, setReviewDoc] = useState<HealthDocument | null>(null);
  const [keep, setKeep] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const dp = getDataProvider();
    setDocs(await dp.getDocuments());
    setConfirmed(await dp.getConfirmedMeasurements());
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async (file: File) => {
    setBusy(true);
    try {
      // Demo extraction: read text-like files directly; for binary files
      // (PDF/images) use the filename + a notice. A production build would
      // run document AI here — same interface.
      let text = "";
      if (file.type.startsWith("text/") || file.name.endsWith(".csv") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        text = await file.text();
      } else {
        text = file.name.replace(/[_.-]/g, " ");
      }
      const extraction: HealthDocument["extraction"] = extractDocument(text, file.name);
      await getDataProvider().addDocument({
        originalFilename: file.name,
        mimeType: file.type || "application/octet-stream",
        documentType: extraction.documentType,
        documentDate: extraction.date,
        extractionStatus: "extracted",
        extraction,
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const startReview = (doc: HealthDocument) => {
    setReviewDoc(doc);
    setKeep(new Set((doc.extraction?.measurements ?? []).map((_, i) => i)));
  };

  const confirm = async () => {
    if (!reviewDoc?.extraction) return;
    const items = reviewDoc.extraction.measurements.filter((_, i) => keep.has(i));
    await getDataProvider().confirmDocumentMeasurements(reviewDoc.id, items);
    setReviewDoc(null);
    await refresh();
  };

  const discard = async (id: string) => {
    await getDataProvider().discardDocument(id);
    await refresh();
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <PageHeader
        eyebrow="Health Data Vault"
        title="Your documents, your confirmation"
        subtitle="Upload PDFs, CSVs, or images of health documents. The app extracts; you confirm. Only confirmed items enter your dataset."
      />
      <SafetyBanner tone="clay">
        Reference ranges shown are educational only. Out-of-range values are not diagnoses — discuss any result with the qualified professional who ordered it.
      </SafetyBanner>

      <Card className="mt-5 border-dashed border-sage-300 bg-white/50">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="font-display text-sm font-semibold text-ink">Upload a health document</p>
          <p className="max-w-sm text-xs leading-relaxed text-ink-faint">
            PDF, CSV, or image. Lab reports, wearable exports, scan summaries. Files stay on your device in demo mode.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.csv,.txt,.md,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
          <Button disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? "Extracting…" : "Choose file"}
          </Button>
        </CardContent>
      </Card>

      {/* Pending extractions */}
      {docs.filter((d) => d.extractionStatus === "extracted").map((doc) => (
        <Card key={doc.id} className="mt-4 border-gold-300/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink">{doc.originalFilename}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="gold">Extraction pending your review</Badge>
                  {doc.documentType !== "other" ? <Badge variant="muted">{doc.documentType.replace("_", " ")}</Badge> : null}
                  {doc.documentDate ? <Badge variant="muted">{doc.documentDate}</Badge> : null}
                </div>
              </div>
            </div>
            {doc.extraction?.measurements.length ? (
              <ul className="mt-3 space-y-1.5">
                {doc.extraction.measurements.map((m) => (
                  <li key={m.name} className="flex justify-between rounded-lg bg-gold-50/70 px-3 py-1.5 text-xs">
                    <span className="text-ink-soft">{m.name}</span>
                    <span className="font-semibold text-ink">{m.value} {m.unit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">No known patterns detected — nothing assumed, nothing added.</p>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => startReview(doc)}>Review & confirm</Button>
              <Button size="sm" variant="ghost" onClick={() => discard(doc.id)}>Discard</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Review modal */}
      {reviewDoc?.extraction ? (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/40 backdrop-blur-sm" onClick={() => setReviewDoc(null)}>
          <div className="mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-paper p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-600">Confirm extraction</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">{reviewDoc.originalFilename}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-faint">{reviewDoc.extraction.notes.join(" ")}</p>
            {reviewDoc.extraction.measurements.length === 0 ? (
              <p className="mt-4 rounded-xl border border-sage-200 bg-white/70 p-4 text-sm text-ink-soft">
                Nothing was extracted. You can discard this document — it will not contribute any data.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {reviewDoc.extraction.measurements.map((m, i) => {
                  const cls = classifyValue(m.value, m.referenceLow, m.referenceHigh);
                  const checked = keep.has(i);
                  return (
                    <label key={`${m.name}-${i}`} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3.5", checked ? "border-sage-400 bg-white" : "border-sage-200 bg-white/50 opacity-60")}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setKeep((cur) => {
                            const next = new Set(cur);
                            if (next.has(i)) next.delete(i); else next.add(i);
                            return next;
                          })
                        }
                        className="h-4 w-4 accent-[#3D6650]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{m.name}</p>
                        <p className="text-xs text-ink-faint">
                          {m.value} {m.unit}
                          {m.referenceLow !== null || m.referenceHigh !== null
                            ? ` · educational reference: ${m.referenceLow ?? "—"}–${m.referenceHigh ?? "—"}`
                            : " · no reference range in document"}
                        </p>
                      </div>
                      {cls === "out-of-range" ? <Badge variant="warn">outside range</Badge> : cls === "in-range" ? <Badge>in range</Badge> : null}
                    </label>
                  );
                })}
              </div>
            )}
            {(() => {
              const anyOutOfRange = reviewDoc.extraction.measurements.some(
                (m, i) => keep.has(i) && classifyValue(m.value, m.referenceLow, m.referenceHigh) === "out-of-range"
              );
              const nudge = consultNudge({ hasOutOfRangeValue: anyOutOfRange });
              return nudge.show ? (
                <SafetyBanner tone="clay">
                  {nudge.reason} Values outside a reference range are data points, not conclusions — bring them to a qualified professional.
                </SafetyBanner>
              ) : null;
            })()}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setReviewDoc(null)}>Cancel</Button>
              <Button onClick={confirm} disabled={keep.size === 0}>Confirm {keep.size > 0 ? `${keep.size} item${keep.size > 1 ? "s" : ""}` : ""}</Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirmed dataset */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Confirmed personal dataset</h2>
        {confirmed.length === 0 ? (
          <Card><CardContent className="p-5 text-sm text-ink-faint">Nothing confirmed yet. Extracted items only appear here after you review and confirm them.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {confirmed.map((c) => {
              const cls = classifyValue(c.value, c.referenceLow, c.referenceHigh);
              return (
                <Card key={c.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-ink-faint">
                        {c.value} {c.unit} · confirmed {new Date(c.confirmedAt).toLocaleDateString("en-MY")}
                        {c.referenceLow !== null || c.referenceHigh !== null ? ` · educational reference ${c.referenceLow ?? "—"}–${c.referenceHigh ?? "—"}` : ""}
                      </p>
                    </div>
                    {cls === "out-of-range" ? <Badge variant="warn">outside range</Badge> : cls === "in-range" ? <Badge>in range</Badge> : null}
                  </CardContent>
                </Card>
              );
            })}
            <p className="pt-1 text-[11px] leading-relaxed text-ink-faint">
              Trends over time are what matter — a single value is a data point, not a verdict.
            </p>
          </div>
        )}
      </section>

      {/* History incl. discarded */}
      {docs.some((d) => d.extractionStatus === "discarded" || d.extractionStatus === "confirmed") ? (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Document history</h2>
          <div className="space-y-2">
            {docs.filter((d) => d.extractionStatus !== "extracted").map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-sage-100 bg-white/50 px-4 py-2.5">
                <span className="truncate text-xs text-ink-soft">{d.originalFilename}</span>
                <Badge variant={d.extractionStatus === "confirmed" ? "default" : "muted"}>{d.extractionStatus}</Badge>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
    </AppShell>
  );
}

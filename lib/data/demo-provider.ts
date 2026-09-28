// ─────────────────────────────────────────────────────────────
// Demo data provider — localStorage-backed implementation of
// the DataProvider contract. Zero backend needed.
// ─────────────────────────────────────────────────────────────

import { seedEvidenceCards } from "@/lib/seed/knowledge";
import {
  demoExperiments,
  demoProfile,
  demoReports,
  seedCommunitiesList,
  seedExperts,
  seedExpertContent,
  seedKnowledgeCards,
  seedPosts,
} from "@/lib/seed/data";
import { scanUserInput } from "@/lib/safety/guardrails";
import type {
  Community,
  CommunityPost,
  ConfirmedMeasurement,
  DataProvider,
  Expert,
  ExpertContent,
  Experiment,
  ExperimentCheckin,
  ExtractedMeasurement,
  HealthDocument,
  MonthlyReport,
  Profile,
  Session,
} from "@/lib/types";

const NS = "longevity-circle";
const KEY = {
  session: `${NS}:demo-session`,
  profile: `${NS}:profile`,
  experiments: `${NS}:experiments`,
  documents: `${NS}:documents`,
  confirmed: `${NS}:confirmed`,
  posts: `${NS}:posts`,
  ai: `${NS}:ai-conversations`,
  consent: `${NS}:consent`,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function today(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// ── Demo document extraction (pattern-based, non-medical) ────

interface ExtractionPattern {
  docType: HealthDocument["documentType"];
  re: RegExp;
  name: string;
  unit: string;
  refLow: number | null;
  refHigh: number | null;
}

// Educational demo patterns only — a real deployment would use
// a proper document-AI pipeline; same interface.
const DEMO_EXTRACTION_PATTERNS: ExtractionPattern[] = [
  { docType: "lab_report", re: /hdl\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "HDL cholesterol", unit: "mmol/L", refLow: 1.0, refHigh: null },
  { docType: "lab_report", re: /ldl\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "LDL cholesterol", unit: "mmol/L", refLow: null, refHigh: 3.4 },
  { docType: "lab_report", re: /hba1c\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "HbA1c", unit: "%", refLow: null, refHigh: 5.6 },
  { docType: "lab_report", re: /fasting glucose\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "Fasting glucose", unit: "mmol/L", refLow: 3.9, refHigh: 5.5 },
  { docType: "lab_report", re: /vitamin d\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "Vitamin D (25-OH)", unit: "nmol/L", refLow: 50, refHigh: 250 },
  { docType: "wearable_export", re: /resting hr\s*[:=]?\s*(\d+)/i, name: "Resting heart rate", unit: "bpm", refLow: null, refHigh: null },
  { docType: "wearable_export", re: /sleep (?:duration|hours)\s*[:=]?\s*(\d+(?:\.\d+)?)/i, name: "Sleep duration", unit: "hours", refLow: null, refHigh: null },
];

export function extractDocument(text: string, filename: string): NonNullable<HealthDocument["extraction"]> {
  const hits: ExtractedMeasurement[] = [];
  let docType: HealthDocument["documentType"] = "other";

  for (const p of DEMO_EXTRACTION_PATTERNS) {
    const m = text.match(p.re);
    if (m) {
      docType = p.docType;
      hits.push({ name: p.name, value: parseFloat(m[1]), unit: p.unit, referenceLow: p.refLow, referenceHigh: p.refHigh });
    }
  }

  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
  const notes: string[] = [];
  if (hits.length === 0) {
    notes.push("No known patterns found. The file is stored, but nothing was extracted — nothing is assumed.");
  } else {
    notes.push("Extracted items below are proposals only. Confirm each one to add it to your dataset.");
  }
  if (/lab|report|blood/i.test(filename) || /lab|panel/i.test(text)) notes.push("Document looks like a lab report (educational extraction, not interpretation).");
  return { documentType: docType, date: dateMatch ? dateMatch[1] : null, measurements: hits, notes };
}

export class DemoDataProvider implements DataProvider {
  async getSession(): Promise<Session | null> {
    return read<Session | null>(KEY.session, null);
  }

  async signInDemo(): Promise<Session> {
    const s: Session = { userId: "user-demo", displayName: "Arthur", role: "admin" };
    write(KEY.session, s);
    return s;
  }

  async signOut(): Promise<void> {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY.session);
  }

  async getProfile(): Promise<Profile | null> {
    const p = read<Profile | null>(KEY.profile, null);
    if (p) return p;
    // First visit: seed the demo profile but leave onboarded=false so the
    // user goes through onboarding themselves.
    const fresh: Profile = { ...demoProfile, onboarded: false, consentGivenAt: null };
    write(KEY.profile, fresh);
    return fresh;
  }

  async saveOnboarding(p: Partial<Profile>): Promise<Profile> {
    const current = (await this.getProfile()) ?? demoProfile;
    const updated: Profile = {
      ...current,
      ...p,
      onboarded: true,
      consentGivenAt: new Date().toISOString(),
    };
    write(KEY.profile, updated);
    return updated;
  }

  async updateProfile(p: Partial<Profile>): Promise<Profile> {
    const current = (await this.getProfile()) ?? demoProfile;
    const updated = { ...current, ...p };
    write(KEY.profile, updated);
    return updated;
  }

  async getEvidenceCards() {
    return seedEvidenceCards;
  }

  async searchEvidence(query: string) {
    const { searchEvidenceCards } = await import("@/lib/rag/retrieval");
    return searchEvidenceCards(query);
  }

  async getExperts(): Promise<Expert[]> {
    return seedExperts;
  }

  async getExpertContent(): Promise<ExpertContent[]> {
    return seedExpertContent;
  }

  async getKnowledgeCards() {
    return seedKnowledgeCards;
  }

  async getExperiments(): Promise<Experiment[]> {
    const user = read<Experiment[]>(KEY.experiments, []);
    if (user.length > 0) return user;
    return demoExperiments;
  }

  async createExperiment(e: Omit<Experiment, "id" | "checkins" | "status">): Promise<Experiment> {
    const list = read<Experiment[]>(KEY.experiments, [...demoExperiments]);
    const created: Experiment = { ...e, id: `exp-${Date.now()}`, checkins: [], status: "draft" };
    const next = [created, ...list];
    write(KEY.experiments, next);
    return created;
  }

  async startExperiment(id: string): Promise<void> {
    const list = read<Experiment[]>(KEY.experiments, [...demoExperiments]);
    const next = list.map((e) =>
      e.id === id ? { ...e, status: "active" as const, startedOn: today(0) } : e
    );
    write(KEY.experiments, next);
  }

  async addCheckin(id: string, c: Omit<ExperimentCheckin, "createdAt">): Promise<void> {
    const list = read<Experiment[]>(KEY.experiments, [...demoExperiments]);
    const next = list.map((e) =>
      e.id === id
        ? {
            ...e,
            checkins: [...e.checkins.filter((x) => x.day !== c.day), { ...c, createdAt: new Date().toISOString() }].sort((a, b) => a.day - b.day),
          }
        : e
    );
    write(KEY.experiments, next);
  }

  async completeExperiment(id: string, reflection: string): Promise<void> {
    const list = read<Experiment[]>(KEY.experiments, [...demoExperiments]);
    const next = list.map((e) =>
      e.id === id ? { ...e, status: "completed" as const, reflection } : e
    );
    write(KEY.experiments, next);
  }

  async addDocument(d: Omit<HealthDocument, "id" | "uploadedAt">): Promise<HealthDocument> {
    const list = read<HealthDocument[]>(KEY.documents, []);
    const doc: HealthDocument = { ...d, id: `doc-${Date.now()}`, uploadedAt: new Date().toISOString() };
    const next = [doc, ...list];
    write(KEY.documents, next);
    return doc;
  }

  async confirmDocumentMeasurements(docId: string, keep: ExtractedMeasurement[]): Promise<void> {
    const list = read<HealthDocument[]>(KEY.documents, []);
    const next = list.map((d) => (d.id === docId ? { ...d, extractionStatus: "confirmed" as const } : d));
    write(KEY.documents, next);
    const confirmed = read<ConfirmedMeasurement[]>(KEY.confirmed, []);
    const rows: ConfirmedMeasurement[] = keep.map((m, i) => ({
      id: `cm-${Date.now()}-${i}`,
      documentId: docId,
      name: m.name,
      value: m.value,
      unit: m.unit,
      referenceLow: m.referenceLow,
      referenceHigh: m.referenceHigh,
      measuredAt: null,
      confirmedAt: new Date().toISOString(),
    }));
    write(KEY.confirmed, [...rows, ...confirmed]);
  }

  async discardDocument(docId: string): Promise<void> {
    const list = read<HealthDocument[]>(KEY.documents, []);
    const next = list.map((d) => (d.id === docId ? { ...d, extractionStatus: "discarded" as const } : d));
    write(KEY.documents, next);
  }

  async getDocuments(): Promise<HealthDocument[]> {
    return read<HealthDocument[]>(KEY.documents, []);
  }

  async getConfirmedMeasurements(): Promise<ConfirmedMeasurement[]> {
    return read<ConfirmedMeasurement[]>(KEY.confirmed, []);
  }

  async getPosts(communitySlug?: string): Promise<CommunityPost[]> {
    const userPosts = read<CommunityPost[]>(KEY.posts, []);
    const all = [...userPosts, ...seedPosts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return communitySlug ? all.filter((p) => p.communitySlug === communitySlug) : all;
  }

  async createPost(p: Pick<CommunityPost, "communitySlug" | "title" | "body">): Promise<CommunityPost> {
    const scan = scanUserInput(`${p.title}\n${p.body}`);
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      communitySlug: p.communitySlug,
      authorName: "You",
      title: p.title,
      body: p.body,
      status: scan.flagged ? "flagged" : "published",
      safetyFlag: scan.flagged ? scan.category : null,
      createdAt: today(0),
    };
    const list = read<CommunityPost[]>(KEY.posts, []);
    write(KEY.posts, [post, ...list]);
    return post;
  }

  async getReports(): Promise<MonthlyReport[]> {
    return demoReports;
  }

  async exportData(): Promise<string> {
    const [profile, experiments, documents, confirmed, posts] = await Promise.all([
      this.getProfile(),
      this.getExperiments(),
      this.getDocuments(),
      this.getConfirmedMeasurements(),
      this.getPosts(),
    ]);
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        format: "longevity-circle.export.v1",
        profile,
        experiments,
        healthDocuments: documents,
        confirmedMeasurements: confirmed,
        communityPosts: posts.filter((p) => p.authorName === "You"),
        note: "Demo export. In production this calls the server export endpoint and writes an audit_logs row.",
      },
      null,
      2
    );
  }

  async deleteAllData(): Promise<void> {
    if (typeof window === "undefined") return;
    for (const key of Object.values(KEY)) {
      window.localStorage.removeItem(key);
    }
  }
}

// ── Community helper (labels for the circles page) ───────────
export function communityList(): Community[] {
  return seedCommunitiesList;
}

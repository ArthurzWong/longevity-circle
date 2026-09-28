// ─────────────────────────────────────────────────────────────
// Longevity Circle — shared domain types
// ─────────────────────────────────────────────────────────────

export type UserRole = "user" | "expert" | "admin";
export type DomainKey = "MOVE" | "THINK" | "RESTORE" | "FUEL" | "CONNECT" | "MEASURE";

export interface Domain {
  key: DomainKey;
  label: string;
  description: string;
  icon: string;
}

export interface Profile {
  id: string;
  displayName: string;
  ageRange: string;
  sex: string;
  preferredLanguage: string;
  activityLevel: string;
  sleepPattern: string;
  nutritionStyle: string;
  stressLevel: string;
  wellnessInterests: string[];
  wearables: string[];
  goals: string[];
  consentGivenAt: string | null;
  onboarded: boolean;
  profileVisibility: "private" | "circle";
  domainBaselines: Partial<Record<DomainKey, number>>; // 1–5 self-reported
}

export type EvidenceStrength = "strong" | "moderate" | "emerging" | "mixed";
export type EvidenceLevel =
  | "meta-analysis" | "rct" | "cohort" | "cross-sectional"
  | "mechanistic" | "expert-opinion" | "demo";
export type SourceType =
  | "who" | "peer-reviewed" | "government" | "university"
  | "expert-authored" | "expert-interview" | "creator";

export interface ResearchSource {
  id: string;
  sourceKey: string;
  title: string;
  author: string;
  publicationDate: string | null;
  sourceType: SourceType;
  url: string | null;
  evidenceLevel: EvidenceLevel | null;
  population: string | null;
  context: string | null;
  retrievedAt: string;
}

export interface EvidenceCard {
  id: string;
  question: string;
  shortAnswer: string;
  evidenceStrength: EvidenceStrength;
  whatStudiesShow: string;
  whatRemainsUncertain: string;
  populationContext: string;
  potentialBenefits: string[];
  potentialRisks: string[];
  expertPerspectives: string[];
  sourceKeys: string[];
  tags: string[];
}

export type KnowledgeCardKind = "takeaway" | "faq" | "discussion" | "experiment_idea";

export interface KnowledgeCard {
  id: string;
  contentId: string;
  expertId: string;
  kind: KnowledgeCardKind;
  title: string;
  body: string;
  demo: boolean;
}

export interface KnowledgeChunk {
  sourceId: string;
  chunkIndex: number;
  title: string;
  author: string;
  publicationDate: string | null;
  sourceType: SourceType;
  url: string | null;
  claim: string;
  evidenceLevel: EvidenceLevel | null;
  population: string | null;
  context: string | null;
  content: string;
  tags: string[];
}

export interface Expert {
  id: string;
  slug: string;
  name: string;
  credentials: string;
  focusAreas: string[];
  bio: string;
  demo: boolean;
}

export type ContentKind = "video" | "audio" | "article" | "pdf" | "transcript" | "research";
export type ContentStatus = "processing" | "published" | "flagged" | "archived";

export interface ExpertContent {
  id: string;
  expertId: string;
  title: string;
  kind: ContentKind;
  durationOrPages: string;
  summary: string;
  status: ContentStatus;
  demo: boolean;
  publishedAt: string;
}

export interface Experiment {
  id: string;
  templateKey: string | null;
  title: string;
  goal: string;
  domain: DomainKey;
  durationDays: number;
  protocol: string;
  metrics: string[];
  baselineNote: string;
  status: "draft" | "active" | "completed" | "abandoned";
  startedOn: string | null;
  reflection: string | null;
  checkins: ExperimentCheckin[];
}

export interface ExperimentCheckin {
  day: number;
  rating: number; // 1–5
  note: string;
  createdAt: string;
}

export type DocumentKind = "lab_report" | "scan" | "wearable_export" | "clinical_note" | "other";
export type ExtractionStatus = "pending" | "extracted" | "confirmed" | "discarded";

export interface ExtractedMeasurement {
  name: string;
  value: number;
  unit: string;
  referenceLow: number | null;
  referenceHigh: number | null;
}

export interface HealthDocument {
  id: string;
  originalFilename: string;
  mimeType: string;
  documentType: DocumentKind;
  documentDate: string | null;
  extractionStatus: ExtractionStatus;
  extraction: {
    documentType: DocumentKind;
    date: string | null;
    measurements: ExtractedMeasurement[];
    notes: string[];
  } | null;
  uploadedAt: string;
}

export interface ConfirmedMeasurement {
  id: string;
  documentId: string | null;
  name: string;
  value: number;
  unit: string;
  referenceLow: number | null;
  referenceHigh: number | null;
  measuredAt: string | null;
  confirmedAt: string;
}

export interface Community {
  slug: string;
  name: string;
  description: string;
}

export interface CommunityPost {
  id: string;
  communitySlug: string;
  authorName: string;
  title: string;
  body: string;
  status: "published" | "flagged" | "removed";
  safetyFlag: string | null;
  createdAt: string;
}

export type EvidenceLabel = "FACT" | "RESEARCH FINDING" | "EXPERT OPINION" | "USER DATA" | "UNCERTAINTY";

export interface LabelledStatement {
  label: EvidenceLabel;
  text: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  labels?: LabelledStatement[];
  sources?: { sourceKey: string; title: string }[];
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  month: string; // YYYY-MM
  whatChanged: string[];
  experimentsCompleted: number;
  habitTrends: string[];
  personalReflections: string[];
  questionsForProfessional: string[];
  nextFocus: string[];
}

export interface Session {
  userId: string;
  displayName: string;
  role: UserRole;
}

// ── Data provider contract ───────────────────────────────────
export interface DataProvider {
  getSession(): Promise<Session | null>;
  signInDemo(): Promise<Session>;
  signOut(): Promise<void>;
  getProfile(): Promise<Profile | null>;
  saveOnboarding(p: Partial<Profile>): Promise<Profile>;
  updateProfile(p: Partial<Profile>): Promise<Profile>;
  getEvidenceCards(): Promise<EvidenceCard[]>;
  searchEvidence(query: string): Promise<EvidenceCard[]>;
  getExperts(): Promise<Expert[]>;
  getExpertContent(): Promise<ExpertContent[]>;
  getKnowledgeCards(): Promise<(KnowledgeCard & { id: string })[]>;
  getExperiments(): Promise<Experiment[]>;
  createExperiment(e: Omit<Experiment, "id" | "checkins" | "status">): Promise<Experiment>;
  startExperiment(id: string): Promise<void>;
  addCheckin(id: string, c: Omit<ExperimentCheckin, "createdAt">): Promise<void>;
  completeExperiment(id: string, reflection: string): Promise<void>;
  addDocument(d: Omit<HealthDocument, "id" | "uploadedAt">): Promise<HealthDocument>;
  confirmDocumentMeasurements(docId: string, keep: ExtractedMeasurement[]): Promise<void>;
  discardDocument(docId: string): Promise<void>;
  getDocuments(): Promise<HealthDocument[]>;
  getConfirmedMeasurements(): Promise<ConfirmedMeasurement[]>;
  getPosts(communitySlug?: string): Promise<CommunityPost[]>;
  createPost(p: Pick<CommunityPost, "communitySlug" | "title" | "body">): Promise<CommunityPost>;
  getReports(): Promise<MonthlyReport[]>;
  exportData(): Promise<string>;
  deleteAllData(): Promise<void>;
}

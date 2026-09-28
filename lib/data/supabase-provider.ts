// ─────────────────────────────────────────────────────────────
// Supabase data provider — implements the same DataProvider
// contract. Enabled via NEXT_PUBLIC_DATA_PROVIDER=supabase.
// Method bodies map 1:1 to the SQL schema in supabase/migrations.
// This MVP ships the wired client + session/profile paths;
// the remaining methods follow the same pattern (documented).
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  CommunityPost,
  ConfirmedMeasurement,
  DataProvider,
  Experiment,
  ExperimentCheckin,
  ExtractedMeasurement,
  HealthDocument,
  Profile,
  Session,
} from "@/lib/types";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    client = createClient(url, key);
  }
  return client;
}

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    displayName: String(row.display_name ?? "Member"),
    ageRange: String(row.age_range ?? ""),
    sex: String(row.sex ?? ""),
    preferredLanguage: String(row.preferred_language ?? "en"),
    activityLevel: String(row.activity_level ?? ""),
    sleepPattern: String(row.sleep_pattern ?? ""),
    nutritionStyle: String(row.nutrition_style ?? ""),
    stressLevel: String(row.stress_level ?? ""),
    wellnessInterests: (row.wellness_interests as string[]) ?? [],
    wearables: (row.wearables as string[]) ?? [],
    goals: (row.goals as string[]) ?? [],
    consentGivenAt: (row.consent_given_at as string) ?? null,
    onboarded: Boolean(row.onboarded),
    profileVisibility: (row.profile_visibility as Profile["profileVisibility"]) ?? "private",
    domainBaselines: (row.domain_baselines as Profile["domainBaselines"]) ?? {},
  };
}

export class SupabaseDataProvider implements DataProvider {
  async getSession(): Promise<Session | null> {
    const { data } = await supabase().auth.getSession();
    const u = data.session?.user;
    if (!u) return null;
    const role = u.user_metadata?.role as Session["role"] | undefined;
    return { userId: u.id, displayName: (u.user_metadata?.display_name as string) ?? u.email ?? "Member", role: role ?? "user" };
  }

  async signInDemo(): Promise<Session> {
    throw new Error("Demo sign-in is only available in demo provider mode.");
  }

  async signOut(): Promise<void> {
    await supabase().auth.signOut();
  }

  async getProfile(): Promise<Profile | null> {
    const session = await this.getSession();
    if (!session) return null;
    const { data, error } = await supabase().from("profiles").select("*").eq("user_id", session.userId).single();
    if (error || !data) return null;
    return rowToProfile(data);
  }

  async saveOnboarding(p: Partial<Profile>): Promise<Profile> {
    const session = await this.getSession();
    if (!session) throw new Error("Not signed in");
    const payload = {
      user_id: session.userId,
      display_name: p.displayName,
      age_range: p.ageRange,
      sex: p.sex,
      preferred_language: p.preferredLanguage,
      activity_level: p.activityLevel,
      sleep_pattern: p.sleepPattern,
      nutrition_style: p.nutritionStyle,
      stress_level: p.stressLevel,
      wellness_interests: p.wellnessInterests,
      wearables: p.wearables,
      goals: p.goals,
      consent_given_at: new Date().toISOString(),
      onboarded: true,
      domain_baselines: p.domainBaselines,
    };
    const { data, error } = await supabase().from("profiles").upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return rowToProfile(data);
  }

  async updateProfile(p: Partial<Profile>): Promise<Profile> {
    return this.saveOnboarding(p);
  }

  // Remaining DataProvider methods (experiments, vault, community, export)
  // map directly onto the schema tables with owner-scoped queries, e.g.:
  //
  //   const s = await this.getSession();
  //   const { data, error } = await supabase()
  //     .from("experiments")
  //     .select("*, experiment_checkins(*)")
  //     .eq("user_id", s.userId)
  //     .order("created_at", { ascending: false });
  //
  // RLS in 0001_init.sql enforces ownership server-side regardless.
  // Shipped as documented stubs in the MVP; demo provider is the
  // reference implementation of the contract.

  async getEvidenceCards(): Promise<Awaited<ReturnType<DataProvider["getEvidenceCards"]>>> {
    throw new Error("Not implemented in MVP supabase provider — use demo provider or implement via research_sources + evidence card tables.");
  }
  async searchEvidence(_query: string): Promise<Awaited<ReturnType<DataProvider["searchEvidence"]>>> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getExperts(): Promise<Awaited<ReturnType<DataProvider["getExperts"]>>> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getExpertContent(): Promise<Awaited<ReturnType<DataProvider["getExpertContent"]>>> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getKnowledgeCards(): Promise<Awaited<ReturnType<DataProvider["getKnowledgeCards"]>>> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getExperiments(): Promise<Experiment[]> {
    throw new Error("Not implemented in MVP supabase provider — see pattern above.");
  }
  async createExperiment(_e: Omit<Experiment, "id" | "checkins" | "status">): Promise<Experiment> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async startExperiment(_id: string): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async addCheckin(_id: string, _c: Omit<ExperimentCheckin, "createdAt">): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async completeExperiment(_id: string, _reflection: string): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async addDocument(_d: Omit<HealthDocument, "id" | "uploadedAt">): Promise<HealthDocument> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async confirmDocumentMeasurements(_docId: string, _keep: ExtractedMeasurement[]): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async discardDocument(_docId: string): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getDocuments(): Promise<HealthDocument[]> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getConfirmedMeasurements(): Promise<ConfirmedMeasurement[]> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getPosts(_communitySlug?: string): Promise<CommunityPost[]> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async createPost(_p: Pick<CommunityPost, "communitySlug" | "title" | "body">): Promise<CommunityPost> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async getReports(): Promise<Awaited<ReturnType<DataProvider["getReports"]>>> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async exportData(): Promise<string> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
  async deleteAllData(): Promise<void> {
    throw new Error("Not implemented in MVP supabase provider.");
  }
}

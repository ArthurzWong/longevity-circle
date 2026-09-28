import type {
  Community,
  CommunityPost,
  Expert,
  ExpertContent,
  Experiment,
  KnowledgeCardKind,
  MonthlyReport,
  Profile,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// DEMO experts — fictional, clearly labelled. No real doctors'
// names, photographs, or endorsements.
// ─────────────────────────────────────────────────────────────

export const seedExperts: Expert[] = [
  {
    id: "exp-reyes",
    slug: "sofia-reyes",
    name: "Dr. Sofia Reyes",
    credentials: "DEMO · Fictional expert profile · PhD Nutritional Sciences",
    focusAreas: ["nutrition", "metabolic health", "body composition"],
    bio: "Fictional nutrition researcher created for this demo. Advocates a food-quality-first approach: build a nutrient-dense dietary pattern first, then consider optional structures like eating windows.",
    demo: true,
  },
  {
    id: "exp-adeyemi",
    slug: "marcus-adeyemi",
    name: "Dr. Marcus Adeyemi",
    credentials: "DEMO · Fictional expert profile · PhD Exercise Physiology, CSCS",
    focusAreas: ["strength", "longevity training", "older adults"],
    bio: "Fictional exercise scientist created for this demo. Believes two full-body strength sessions per week is the highest-leverage habit for adults 35+.",
    demo: true,
  },
  {
    id: "exp-lian",
    slug: "amara-lian",
    name: "Dr. Amara Lian",
    credentials: "DEMO · Fictional expert profile · MD (Sleep Medicine, fictional)",
    focusAreas: ["sleep", "circadian health", "recovery"],
    bio: "Fictional sleep-medicine specialist created for this demo. Prioritises a consistent wake time, a real wind-down buffer, and a personal caffeine cut-off over perfect numbers.",
    demo: true,
  },
  {
    id: "exp-watanabe",
    slug: "kenji-watanabe",
    name: "Dr. Kenji Watanabe",
    credentials: "DEMO · Fictional expert profile · PhD Behavioural Psychology",
    focusAreas: ["stress", "habit design", "mind"],
    bio: "Fictional behavioural psychologist created for this demo. Designs minimum-viable habits: 8 minutes of daily practice beats an hour done occasionally.",
    demo: true,
  },
  {
    id: "exp-rahman",
    slug: "nadia-rahman",
    name: "Coach Nadia Rahman",
    credentials: "DEMO · Fictional expert profile · MSc Sports Coaching",
    focusAreas: ["walking", "mobility", "Tai Chi / Qigong", "50+ performance"],
    bio: "Fictional movement coach created for this demo. Anchors daily walks to existing routines and earns mobility through strength.",
    demo: true,
  },
];

export const seedExpertContent: ExpertContent[] = [
  { id: "ec-1", expertId: "exp-adeyemi", title: "Strength After 35: The Minimum Effective Dose", kind: "video", durationOrPages: "18 min", summary: "Why two full-body sessions weekly may be the highest-leverage longevity habit. DEMO content.", status: "published", demo: true, publishedAt: "2026-08-12" },
  { id: "ec-2", expertId: "exp-lian", title: "The Consistent Wake-Up: A Sleep Masterclass", kind: "audio", durationOrPages: "42 min", summary: "Anchor time, light, caffeine cut-offs, and wind-down buffers. DEMO content.", status: "published", demo: true, publishedAt: "2026-08-20" },
  { id: "ec-3", expertId: "exp-reyes", title: "Protein Across the Day (Without Obsession)", kind: "article", durationOrPages: "9 pages", summary: "A palm-sized portion at each meal; practical patterns for 1.0–1.2 g/kg/day. DEMO content.", status: "published", demo: true, publishedAt: "2026-09-02" },
  { id: "ec-4", expertId: "exp-watanabe", title: "Stress Is a Skill: The 8-Minute Protocol", kind: "video", durationOrPages: "24 min", summary: "A minimum-viable mindfulness practice you can actually keep. DEMO content.", status: "published", demo: true, publishedAt: "2026-09-10" },
  { id: "ec-5", expertId: "exp-rahman", title: "Walking Meditation & Qigong Basics", kind: "pdf", durationOrPages: "14 pages", summary: "Gentle mobility and balance practice for daily life. DEMO content.", status: "published", demo: true, publishedAt: "2026-09-15" },
  { id: "ec-6", expertId: "exp-lian", title: "Interview: What Sleep Trackers Can and Cannot Tell You", kind: "transcript", durationOrPages: "31 min", summary: "Where wearable sleep data helps, where it misleads. DEMO content.", status: "published", demo: true, publishedAt: "2026-09-18" },
  { id: "ec-7", expertId: "exp-adeyemi", title: "Loaded Mobility forDesk Workers", kind: "article", durationOrPages: "7 pages", summary: "Earning range of motion through strength. DEMO content.", status: "published", demo: true, publishedAt: "2026-09-21" },
];

// ─────────────────────────────────────────────────────────────
// AI-generated knowledge cards (DEMO) — takeaway / faq / discussion
// ─────────────────────────────────────────────────────────────

export interface SeedKnowledgeCard {
  id: string;
  contentId: string;
  expertId: string;
  kind: KnowledgeCardKind;
  title: string;
  body: string;
  demo: boolean;
}

export const seedKnowledgeCards: SeedKnowledgeCard[] = [
  { id: "kc-1", contentId: "ec-1", expertId: "exp-adeyemi", kind: "takeaway", title: "Two sessions is a real dose", body: "The meta-analytic signal for muscle-strengthening activity peaks around 30–60 min/week — two 30-minute full-body sessions hit that band.", demo: true },
  { id: "kc-2", contentId: "ec-1", expertId: "exp-adeyemi", kind: "faq", title: "Do I need a gym?", body: "No. Loaded movement at home (bands, dumbbells, bodyweight progressions) covers the same pattern categories: push, pull, squat, hinge, carry.", demo: true },
  { id: "kc-3", contentId: "ec-1", expertId: "exp-adeyemi", kind: "discussion", title: "What's your current minimum?", body: "What is the smallest strength routine you've sustained for 3+ months? What made it stick?", demo: true },
  { id: "kc-4", contentId: "ec-2", expertId: "exp-lian", kind: "takeaway", title: "Wake time is the anchor", body: "A consistent wake time stabilises the whole circadian pattern — more robust than forcing an earlier bedtime.", demo: true },
  { id: "kc-5", contentId: "ec-2", expertId: "exp-lian", kind: "faq", title: "When should I stop caffeine?", body: "Caffeine's half-life is ~5–6 hours. Many people sleep measurably better with a cut-off 8+ hours before bed. Test it as a 14-day experiment.", demo: true },
  { id: "kc-6", contentId: "ec-2", expertId: "exp-lian", kind: "discussion", title: "Your wind-down buffer", body: "What do the last 30 minutes before bed actually look like on a typical night? What would a realistic buffer contain?", demo: true },
  { id: "kc-7", contentId: "ec-4", expertId: "exp-watanabe", kind: "takeaway", title: "Consistency beats duration", body: "Trial evidence for mindfulness comes from structured 8-week programs; daily 8-minute practice outperforms sporadic long sessions for adherence.", demo: true },
  { id: "kc-8", contentId: "ec-4", expertId: "exp-watanabe", kind: "experiment_idea", title: "8-minute daily sit", body: "Run a 14-day experiment: 8 minutes of breath-focus practice each morning, rate perceived stress 1–5 daily.", demo: true },
  { id: "kc-9", contentId: "ec-6", expertId: "exp-lian", kind: "faq", title: "Can I trust my sleep score?", body: "Wearables estimate sleep stages imperfectly. Trends and timing are more reliable than nightly scores. Don't chase a number at the expense of feeling rested.", demo: true },
  { id: "kc-10", contentId: "ec-5", expertId: "exp-rahman", kind: "experiment_idea", title: "Walk-after-meals pattern", body: "A 10-minute easy walk after your largest meal, daily for 14 days. Track energy and sleep onset.", demo: true },
];

// ─────────────────────────────────────────────────────────────
// Communities (5 seeded circles from the brief's list of 10)
// ─────────────────────────────────────────────────────────────

export const seedCommunities: Community[] = [
  { slug: "sleep", name: "Sleep", description: "Wind-down routines, caffeine timing, sleep experiments." },
  { slug: "strength", name: "Strength", description: "Minimum effective doses, programs, progress." },
  { slug: "nutrition", name: "Nutrition", description: "Food-first patterns, protein, fasting discussions." },
  { slug: "mind", name: "Mind", description: "Stress, meditation practice, focus." },
  { slug: "50-plus-performance", name: "50+ Performance", description: "Staying capable, strong and curious after fifty." },
];

export const seedPosts: CommunityPost[] = [
  { id: "post-1", communitySlug: "sleep", authorName: "Wei M.", title: "14-day caffeine cut-off experiment — results", body: "Moved my last coffee to 12:30pm for two weeks. Sleep-onset felt faster most nights and my average bedtime rating went from 3 to 4. Small sample, one person, but I'm keeping it. Educational note: I'm sharing a self-experiment, not advice.", status: "published", safetyFlag: null, createdAt: "2026-09-24" },
  { id: "post-2", communitySlug: "strength", authorName: "Ravi K.", title: "What does your 2×/week full-body session look like?", body: "Curious how others structure two weekly sessions around work. Mine: squat pattern, push, pull, hinge, carry — 40 minutes each. Sharing patterns, not prescriptions.", status: "published", safetyFlag: null, createdAt: "2026-09-23" },
  { id: "post-3", communitySlug: "nutrition", authorName: "Hui L.", title: "Protein at breakfast — practical ideas", body: "Struggling to hit ~25–30g protein at breakfast without eggs. What food-first patterns work for you? (Educational discussion only — for personal medical questions I'd talk to a dietitian.)", status: "published", safetyFlag: null, createdAt: "2026-09-22" },
  { id: "post-4", communitySlug: "mind", authorName: "Aisha N.", title: "8 minutes a day for 30 days", body: "The 'minimum viable practice' idea from the Studio content finally made meditation stick for me. 24 of 30 days done. Stress ratings trending down. What's your minimum?", status: "published", safetyFlag: null, createdAt: "2026-09-25" },
  { id: "post-5", communitySlug: "50-plus-performance", authorName: "David T.", title: "Balance work after 50", body: "Added 5 minutes of single-leg stance and heel-toe walking most evenings. Noticeably steadier on hikes. Would love to hear others' balance routines.", status: "published", safetyFlag: null, createdAt: "2026-09-20" },
  { id: "post-6", communitySlug: "sleep", authorName: "Demo Member", title: "Flawed post kept for admin demo", body: "This post is intentionally kept in the seed to demonstrate the admin flagged-content workflow.", status: "flagged", safetyFlag: "medical_request", createdAt: "2026-09-19" },
];

// ─────────────────────────────────────────────────────────────
// Experiment templates (7 seed experiments from the brief)
// ─────────────────────────────────────────────────────────────

export interface ExperimentTemplate {
  key: string;
  title: string;
  goal: string;
  domain: Experiment["domain"];
  durationDays: number;
  protocol: string;
  metrics: string[];
  baselineNote: string;
}

export const seedExperimentTemplates: ExperimentTemplate[] = [
  { key: "sleep-window", title: "Consistent wake time", goal: "Stabilise sleep timing with a fixed wake anchor", domain: "RESTORE", durationDays: 14, protocol: "Set one wake time for all 14 days. Get daylight within 30 minutes of waking. Keep a 30-minute wind-down buffer before bed. Record nightly sleep quality (1–5) and morning energy (1–5).", metrics: ["sleep quality 1–5", "morning energy 1–5"], baselineNote: "Note your current wake-time variability and typical sleep quality for 3 days before starting." },
  { key: "walking-8k", title: "Daily 8,000 steps", goal: "Raise daily movement to the 8,000-step band", domain: "MOVE", durationDays: 14, protocol: "Anchor walks to existing routines (commute, lunch, after dinner). Track daily steps. No intensity target — volume only.", metrics: ["daily steps", "energy 1–5"], baselineNote: "Record your average daily steps over the past week." },
  { key: "strength-2x", title: "Two full-body strength sessions", goal: "Establish a sustainable twice-weekly strength habit", domain: "MOVE", durationDays: 21, protocol: "Two 30–40 minute full-body sessions weekly (squat, push, pull, hinge, carry). Keep 2+ days between sessions. Log session completion and post-session energy.", metrics: ["sessions completed", "post-session energy 1–5"], baselineNote: "Note current strength routine (or none) and any movement limitations." },
  { key: "meditation-8min", title: "8-minute daily mindfulness", goal: "Build a minimum-viable daily practice", domain: "THINK", durationDays: 14, protocol: "8 minutes of breath-focus practice each morning. Rate perceived stress (1–5) and focus (1–5) each evening.", metrics: ["perceived stress 1–5", "focus 1–5"], baselineNote: "Rate your average stress and focus over the past 3 days." },
  { key: "caffeine-cutoff", title: "Caffeine cut-off experiment", goal: "Test whether an earlier caffeine cut-off improves sleep", domain: "RESTORE", durationDays: 14, protocol: "Set a personal cut-off (e.g., 12:30pm). No caffeine after it for 14 days. Track sleep quality (1–5) and sleep-onset difficulty nightly.", metrics: ["sleep quality 1–5", "sleep-onset difficulty 1–5"], baselineNote: "Record your usual last-caffeine time and a 3-day sleep baseline." },
  { key: "protein-breakfast", title: "Protein-forward breakfasts", goal: "Reach ~25–30g protein at breakfast, food-first", domain: "FUEL", durationDays: 14, protocol: "Build breakfast around a protein anchor (eggs, yoghurt, tofu, fish, leftovers). Track whether the target was met and mid-morning hunger (1–5).", metrics: ["target met (y/n)", "mid-morning hunger 1–5"], baselineNote: "Note your current breakfast pattern and hunger levels for 2–3 days." },
  { key: "mobility-evenings", title: "10-minute evening mobility", goal: "Daily gentle mobility for hips, shoulders, and balance", domain: "MOVE", durationDays: 14, protocol: "10 minutes: hip openers, shoulder circles, cat-cow, single-leg stance (30s/side), heel-toe walking. Rate morning stiffness (1–5).", metrics: ["morning stiffness 1–5", "session completed (y/n)"], baselineNote: "Rate current morning stiffness and note any uncomfortable movements." },
];

// ─────────────────────────────────────────────────────────────
// Demo profile & user data (simulated returning member)
// ─────────────────────────────────────────────────────────────

export const demoProfile: Profile = {
  id: "profile-demo",
  displayName: "Arthur",
  ageRange: "35–44",
  sex: "prefer_not_to_say",
  preferredLanguage: "en",
  activityLevel: "lightly active",
  sleepPattern: "7–8h, irregular timing",
  nutritionStyle: "omnivore",
  stressLevel: "moderate",
  wellnessInterests: ["sleep", "strength", "nutrition"],
  wearables: ["smartwatch"],
  goals: ["Sleep consistently", "Build strength habit"],
  consentGivenAt: "2026-09-01",
  onboarded: true,
  profileVisibility: "private",
  domainBaselines: { MOVE: 3, THINK: 3, RESTORE: 2, FUEL: 3, CONNECT: 4, MEASURE: 2 },
};

export const demoExperiments: Experiment[] = [
  {
    id: "exp-active-1",
    templateKey: "caffeine-cutoff",
    title: "Caffeine cut-off experiment",
    goal: "Test whether an earlier caffeine cut-off improves sleep",
    domain: "RESTORE",
    durationDays: 14,
    protocol: "Set a personal cut-off (12:30pm). No caffeine after it for 14 days. Track sleep quality and sleep-onset difficulty nightly.",
    metrics: ["sleep quality 1–5", "sleep-onset difficulty 1–5"],
    baselineNote: "Usual last coffee: 4pm. 3-day baseline sleep quality avg: 3.0",
    status: "active",
    startedOn: "2026-09-22",
    reflection: null,
    checkins: [
      { day: 1, rating: 3, note: "Missed the cut-off once — dinner meeting.", createdAt: "2026-09-22" },
      { day: 2, rating: 4, note: "Fell asleep noticeably faster.", createdAt: "2026-09-23" },
      { day: 3, rating: 4, note: "Slightly groggy mid-afternoon.", createdAt: "2026-09-24" },
      { day: 4, rating: 4, note: "Steady.", createdAt: "2026-09-25" },
      { day: 5, rating: 5, note: "Best night of the week.", createdAt: "2026-09-26" },
      { day: 6, rating: 3, note: "Late deadline, but kept the cut-off.", createdAt: "2026-09-27" },
    ],
  },
  {
    id: "exp-active-2",
    templateKey: "strength-2x",
    title: "Two full-body strength sessions",
    goal: "Establish a sustainable twice-weekly strength habit",
    domain: "MOVE",
    durationDays: 21,
    protocol: "Two 30–40 minute full-body sessions weekly (squat, push, pull, hinge, carry).",
    metrics: ["sessions completed", "post-session energy 1–5"],
    baselineNote: "No consistent routine in past 3 months.",
    status: "active",
    startedOn: "2026-09-15",
    reflection: null,
    checkins: [
      { day: 1, rating: 4, note: "Session 1 done — kept loads modest.", createdAt: "2026-09-15" },
      { day: 4, rating: 4, note: "Session 2 done.", createdAt: "2026-09-18" },
      { day: 8, rating: 5, note: "Session 3 — feeling stronger.", createdAt: "2026-09-22" },
      { day: 11, rating: 4, note: "Session 4 done.", createdAt: "2026-09-25" },
    ],
  },
  {
    id: "exp-done-1",
    templateKey: "walking-8k",
    title: "Daily 8,000 steps",
    goal: "Raise daily movement to the 8,000-step band",
    domain: "MOVE",
    durationDays: 14,
    protocol: "Anchor walks to existing routines. Track daily steps.",
    metrics: ["daily steps", "energy 1–5"],
    baselineNote: "Average ~5,400 steps/day.",
    status: "completed",
    startedOn: "2026-09-01",
    reflection: "Hit 8k on 11 of 14 days. Lunch walk was the keystone. Energy ratings up ~0.8 on average. Keeping the lunch walk permanently; will run the strength experiment next.",
    checkins: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      rating: i === 5 || i === 11 ? 2 : 4,
      note: i === 5 ? "Rainy day, only 4.2k steps." : i === 11 ? "Travel day." : "",
      createdAt: `2026-09-${String(1 + i).padStart(2, "0")}`,
    })),
  },
];

export const demoReports: MonthlyReport[] = [
  {
    id: "rep-aug",
    month: "2026-08",
    whatChanged: [
      "Established a (mostly) consistent ~6:45am wake time on weekdays.",
      "Average daily steps rose from ~5,100 to ~6,800.",
    ],
    experimentsCompleted: 0,
    habitTrends: [
      "Sleep quality ratings averaged 3.2/5, trending up in the final week.",
      "Evenings with a wind-down buffer correlated with +0.6 sleep quality.",
    ],
    personalReflections: [
      "The hardest part was not the habits themselves but protecting the calendar around them.",
      "Morning daylight walks doubled as thinking time — unexpectedly valuable.",
    ],
    questionsForProfessional: [
      "My self-reported sleep seems adequate but I often wake unrefreshed — what should I discuss at a routine check-up?",
    ],
    nextFocus: ["Run the daily 8,000 steps experiment", "Set a caffeine cut-off after 2pm"],
  },
  {
    id: "rep-sep",
    month: "2026-09",
    whatChanged: [
      "Completed the 14-day 8,000-step experiment (11/14 target days).",
      "Started the caffeine cut-off experiment; last coffee moved from ~4pm to 12:30pm.",
      "Restarted strength training — 4 sessions in 11 days.",
    ],
    experimentsCompleted: 1,
    habitTrends: [
      "Steps: weekday median ~8,400, weekend median ~6,100.",
      "Sleep quality improved from 3.2 to 3.7 average since the caffeine cut-off began.",
      "Energy ratings on strength days averaged 4.1/5.",
    ],
    personalReflections: [
      "Anchoring the walk to lunch made 8k feel effortless most days.",
      "Strength sessions feel sustainable at two per week — three was too much in August.",
    ],
    questionsForProfessional: [
      "Is my self-reported sleep-quality trend (3.2 → 3.7) a reasonable thing to track long-term, or would a more structured assessment be useful?",
    ],
    nextFocus: ["Finish the caffeine cut-off experiment with a reflection", "Keep 2×/week strength through October", "Add one weekly mobility session"],
  },
  {
    id: "rep-sep-preview",
    month: "2026-10 (preview)",
    whatChanged: ["Month in progress — this preview updates as you check in."],
    experimentsCompleted: 0,
    habitTrends: ["6 check-ins logged in the first 6 days — best start of any month so far."],
    personalReflections: ["Running two experiments at once is manageable when they touch different domains."],
    questionsForProfessional: [],
    nextFocus: ["Complete both active experiments", "Write reflections while fresh"],
  },
];

export const demoDocuments = [] as never[]; // Vault starts empty; users upload their own

export const seedCommunitiesList = seedCommunities;

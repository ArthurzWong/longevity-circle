// ─────────────────────────────────────────────────────────────
// Longevity AI — demo composer.
// Rule-based response builder grounded in retrieved chunks.
// Same output contract as the server LLM path: structured
// sections, evidence labels, citation integrity, safety scan.
// ─────────────────────────────────────────────────────────────

import { retrieve, type ScoredChunk } from "@/lib/rag/retrieval";
import { scanUserInput, scanBannedClaims } from "@/lib/safety/guardrails";
import type { AiMessage, LabelledStatement } from "@/lib/types";

export interface ComposerContext {
  displayName?: string;
  hasActiveExperiments?: boolean;
  latestSleepRating?: number;
  profileSummary?: string;
}

export interface ComposerResult {
  reply: string;
  labels: LabelledStatement[];
  sources: { sourceKey: string; title: string }[];
  blocked: boolean;
}

function formatChunkCitation(c: ScoredChunk): string {
  return `${c.chunk.claim} — ${c.chunk.title}${c.chunk.author ? ` (${c.chunk.author.split(",")[0]}${c.chunk.author.includes(",") ? " et al." : ""})` : ""}`;
}

/** Build the structured demo answer for a knowledge question. */
export function composeKnowledgeAnswer(query: string, ctx: ComposerContext = {}): ComposerResult {
  const { chunks, sources } = retrieve(query);

  if (chunks.length === 0) {
    return {
      reply: [
        `**ANSWER**\nI don't have evidence in my knowledge base that directly addresses "${query}".`,
        `**WHAT THE EVIDENCE SAYS**\nNothing retrieved — I won't improvise an answer.`,
        `**WHAT IS UNCERTAIN**\nEverything here, until we find sources.`,
        `**HOW THIS MAY RELATE TO YOU**\nTry rephrasing with terms like sleep, walking, strength, fasting, protein, coffee, meditation, or connection.`,
        `**POSSIBLE NEXT STEP**\nExplore the Evidence Explorer, or ask about one of the suggested prompts.`,
        `**WHEN TO CONSULT A PROFESSIONAL**\nIf this concerns symptoms or a personal medical question, please speak with a qualified professional.`,
        `**SOURCES**\nNone retrieved.`,
      ].join("\n\n"),
      labels: [],
      sources: [],
      blocked: false,
    };
  }

  const top = chunks[0];
  const supporting = chunks.slice(1, 3);
  const hasResearch = sources.some((s) => ["peer-reviewed", "who", "government", "university"].includes(s.sourceType));

  const labels: LabelledStatement[] = [];
  labels.push({ label: "RESEARCH FINDING", text: top.chunk.claim });
  labels.push({
    label: hasResearch ? "RESEARCH FINDING" : "EXPERT OPINION",
    text: `Evidence level of the primary source: ${top.chunk.evidenceLevel ?? "ungraded"}. Population: ${top.chunk.population ?? "not specified"}.`,
  });
  labels.push({ label: "UNCERTAINTY", text: "Observational associations cannot prove causation; individual responses vary." });
  labels.push({ label: "FACT", text: "Longevity Circle provides education, not medical assessment." });
  if (ctx.latestSleepRating) labels.push({ label: "USER DATA", text: `Your latest logged sleep rating is ${ctx.latestSleepRating}/5.` });

  const reply = [
    `**ANSWER**\n${top.chunk.claim}`,
    `**WHAT THE EVIDENCE SAYS**\n${top.chunk.content}\n\n${supporting.map((c) => `• ${formatChunkCitation(c)}`).join("\n")}`,
    `**WHAT IS UNCERTAIN**\n• Observational findings can't fully exclude reverse causation or confounding.\n• Optimal choices depend on your context, training history, and any medical considerations.\n• ${top.chunk.evidenceLevel === "expert-opinion" ? "The primary source here is expert consensus, not trial data." : "Trial evidence in this area is mostly short- to medium-term."}`,
    `**HOW THIS MAY RELATE TO YOU**\n${ctx.hasActiveExperiments ? "You have active experiments — you could fold this into one of them." : "A small 14-day self-experiment is a practical way to observe your own response."} Your baseline stays self-reported and educational.`,
    `**POSSIBLE NEXT STEP**\nCreate a related experiment in the Experiments hub, or explore the evidence card for context.`,
    `**WHEN TO CONSULT A PROFESSIONAL**\nIf this touches an existing condition, medication, or symptoms, discuss changes with a doctor or qualified professional first.`,
    `**SOURCES**\n${sources.map((s) => `[${s.sourceKey}] ${s.title} — ${s.author}${s.publicationDate ? ` (${s.publicationDate})` : ""}${s.url ? ` · ${s.url}` : ""}`).join("\n")}`,
  ].join("\n\n");

  const banned = scanBannedClaims(reply);
  if (banned.flagged) {
    // Defensive: composer should never emit these, but block anyway.
    return {
      reply: "I can't provide that framing. Longevity Circle never predicts lifespan or claims to reverse ageing — but I can share what the evidence says about specific habits.",
      labels: [{ label: "UNCERTAINTY", text: "Response blocked by safety scan." }],
      sources: [],
      blocked: true,
    };
  }

  return { reply, labels, sources: sources.map((s) => ({ sourceKey: s.sourceKey, title: s.title })), blocked: false };
}

/** Suggested prompts per brief. */
export const suggestedPrompts = [
  "Explain my recent sleep pattern.",
  "Create a 14-day experiment.",
  "Explain this health report.",
  "Compare these longevity claims.",
  "What should I focus on first?",
  "What did this expert say?",
];

/** Handle user data / coaching-style questions in demo mode. */
export function composeUserDataAnswer(query: string, ctx: ComposerContext = {}): ComposerResult {
  const q = query.toLowerCase();

  if (q.includes("sleep pattern") || q.includes("recent sleep") || q.includes("my sleep")) {
    const r = ctx.latestSleepRating ?? 4;
    const reply = [
      `**ANSWER**\nYour recent sleep self-ratings average around ${r}/5, with the best nights following earlier caffeine cut-offs.`,
      `**WHAT THE EVIDENCE SAYS**\nSleep regularity and timing are consistently associated with subjective sleep quality; your pattern matches that picture. [RESEARCH FINDING]`,
      `**WHAT IS UNCERTAIN**\nSelf-ratings ≠ measured sleep; wearable estimates and how rested you feel can diverge. [UNCERTAINTY]`,
      `**HOW THIS MAY RELATE TO YOU**\nYour caffeine cut-off experiment is the active lever here — keep logging nightly ratings through day 14. [USER DATA]`,
      `**POSSIBLE NEXT STEP**\nComplete the current experiment, then decide whether to keep, adjust, or stop the cut-off.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nPersistent unrefreshing sleep despite good habits is worth raising with a professional.`,
      `**SOURCES**\n[cappuccio-2010] Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-analysis — Cappuccio FP et al. (2010) · https://doi.org/10.1093/sleep/33.5.585`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "USER DATA", text: `Sleep ratings average ~${r}/5.` },
        { label: "RESEARCH FINDING", text: "Timing and regularity associate with sleep quality." },
        { label: "UNCERTAINTY", text: "Self-report is subjective; no causal claim." },
      ],
      sources: [{ sourceKey: "cappuccio-2010", title: "Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-analysis" }],
      blocked: false,
    };
  }

  if (q.includes("14-day experiment") || q.includes("create a") || q.includes("experiment for")) {
    const reply = [
      `**ANSWER**\nBased on what you're tracking, a 14-day "evening mobility + wind-down" experiment fits well: 10 gentle minutes each evening, rating morning stiffness and sleep quality.`,
      `**WHAT THE EVIDENCE SAYS**\nWHO guidance favours multicomponent activity (balance + flexibility + strength) for function with age; sleep-hygiene literature favours a protected wind-down buffer. [RESEARCH FINDING]`,
      `**WHAT IS UNCERTAIN**\nWhether *you* personally see a measurable stiffness/sleep change in 14 days — that's exactly what the experiment tests. [UNCERTAINTY]`,
      `**HOW THIS MAY RELATE TO YOU**\nYou already run strength and caffeine experiments; this touches a different domain so it won't confound them. [USER DATA]`,
      `**POSSIBLE NEXT STEP**\nOpen Experiments → "Daily 8,000 steps" template gallery → create your own from the mobility-evenings template.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nIf any movement causes pain, stop and get professional guidance.`,
      `**SOURCES**\n[who-pa-2020] WHO Guidelines on Physical Activity and Sedentary Behaviour — World Health Organization (2020) · https://www.who.int/publications/i/item/9789240015128`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "RESEARCH FINDING", text: "Multicomponent activity supports function; wind-down buffers support sleep." },
        { label: "USER DATA", text: "Two active experiments, different domains." },
        { label: "UNCERTAINTY", text: "Individual 14-day response is unknown until tested." },
      ],
      sources: [{ sourceKey: "who-pa-2020", title: "WHO Guidelines on Physical Activity and Sedentary Behaviour" }],
      blocked: false,
    };
  }

  if (q.includes("focus") || q.includes("first") || q.includes("priority")) {
    const reply = [
      `**ANSWER**\nIf I look only at your self-reported data: sleep timing is your weakest domain (baseline 2/5) with the most active positive trend — staying the course is the priority.`,
      `**WHAT THE EVIDENCE SAYS**\nBehaviour change research generally supports consolidating one keystone habit before adding load. [RESEARCH FINDING]`,
      `**WHAT IS UNCERTAIN**\nPriorities shift with life context; you're the authority on what's feasible. [UNCERTAINTY]`,
      `**HOW THIS MAY RELATE TO YOU**\nTwo experiments are active and trending well; adding a third this week risks splitting attention. [USER DATA]`,
      `**POSSIBLE NEXT STEP**\nFinish the caffeine experiment (day 6/14), write the reflection, then choose the next one.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nIf stress or low mood are driving the scores, a professional conversation beats another habit.`,
      `**SOURCES**\nNone — this reflection is based on your self-reported data and general behaviour-change principles.`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "USER DATA", text: "RESTORE baseline 2/5; caffeine experiment on day 6/14." },
        { label: "RESEARCH FINDING", text: "Keystone-habit consolidation is a common behaviour-change finding." },
        { label: "UNCERTAINTY", text: "Personal priorities vary." },
      ],
      sources: [],
      blocked: false,
    };
  }

  if (q.includes("expert") || q.includes("said")) {
    const reply = [
      `**ANSWER**\nIn the (fictional, DEMO) Expert Circle, Dr. Amara Lian's position is: anchor wake time first, protect a 30-minute wind-down, and set a personal caffeine cut-off — numbers second.`,
      `**WHAT THE EVIDENCE SAYS**\nThis aligns with the sleep-regularity findings in the knowledge base. [RESEARCH FINDING]`,
      `**WHAT IS UNCERTAIN**\nIt's an expert perspective, not a trial result — treat it as informed opinion. [EXPERT OPINION]`,
      `**HOW THIS MAY RELATE TO YOU**\nYour caffeine experiment directly tests one of her three levers. [USER DATA]`,
      `**POSSIBLE NEXT STEP**\nWatch the "Consistent Wake-Up" masterclass in the Expert Circle and generate its knowledge cards.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nFor suspected sleep disorders, seek a qualified sleep clinician.`,
      `**SOURCES**\n[cappuccio-2010] Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-analysis — Cappuccio FP et al. (2010) · https://doi.org/10.1093/sleep/33.5.585`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "EXPERT OPINION", text: "Dr. Amara Lian (DEMO fictional expert) on wake-time anchoring." },
        { label: "RESEARCH FINDING", text: "Sleep regularity associates with quality." },
        { label: "USER DATA", text: "Caffeine experiment in progress." },
      ],
      sources: [{ sourceKey: "cappuccio-2010", title: "Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-analysis" }],
      blocked: false,
    };
  }

  if (q.includes("report") || q.includes("health report") || q.includes("explain this")) {
    const reply = [
      `**ANSWER**\nUpload it to the Health Data Vault — it extracts document type, date, measurements, units and reference ranges, and shows you the original alongside the extraction. Nothing enters your dataset until you confirm each item.`,
      `**WHAT THE EVIDENCE SAYS**\nBiomarker values are educational data points; interpretation requires personal clinical context. [FACT]`,
      `**WHAT IS UNCERTAIN**\nI can't interpret values as diagnosis — extraction is not assessment. [UNCERTAINTY]`,
      `**HOW THIS MAY RELATE TO YOU**\nOnce confirmed, values appear in your Vault history for trend-watching over time. [USER DATA]`,
      `**POSSIBLE NEXT STEP**\nGo to Vault → Upload PDF/CSV/image → review the extraction → confirm items you recognise.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nOut-of-range values should be discussed with the professional who ordered the test.`,
      `**SOURCES**\nNone — document guidance, not an evidence question.`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "FACT", text: "Biomarker interpretation requires clinical context." },
        { label: "UNCERTAINTY", text: "Extraction is not assessment." },
      ],
      sources: [],
      blocked: false,
    };
  }

  if (q.includes("compare") || q.includes("claims")) {
    const reply = [
      `**ANSWER**\nGive me the two claims and I'll compare evidence strength, population, and source type side by side. In demo mode, try: "fastering extends lifespan" vs "strength training lowers mortality risk".`,
      `**WHAT THE EVIDENCE SAYS**\nThe fasting claim rests on animal + short human trials (mixed evidence); the strength claim rests on meta-analysis of ~480k participants (strong). [RESEARCH FINDING]`,
      `**WHAT IS UNCERTAIN**\nComparative claims often mix evidence grades — the honest comparison names the gap. [UNCERTAINTY]`,
      `**HOW THIS MAY RELATE TO YOU**\nStronger evidence + easier adherence usually beats exotic-but-weak claims for habit choice. [FACT]`,
      `**POSSIBLE NEXT STEP**\nOpen Evidence Explorer and compare the two cards directly.`,
      `**WHEN TO CONSULT A PROFESSIONAL**\nFor supplement or treatment comparisons, involve a professional.`,
      `**SOURCES**\n[momma-2022] Muscle-strengthening Activities Are Associated with Lower Risk of Mortality — Momma H et al. (2022) · https://doi.org/10.1136/bjsports-2021-103924\n[decabo-mattson-2019] Effects of Intermittent Fasting on Health, Aging, and Disease — de Cabo R, Mattson MP (2019) · https://doi.org/10.1056/NEJMra1905136`,
    ].join("\n\n");
    return {
      reply,
      labels: [
        { label: "RESEARCH FINDING", text: "Strength evidence is meta-analytic; fasting evidence is mixed." },
        { label: "FACT", text: "Evidence strength and adherence both matter for habit choice." },
        { label: "UNCERTAINTY", text: "Comparative claims often mix evidence grades." },
      ],
      sources: [
        { sourceKey: "momma-2022", title: "Muscle-strengthening Activities Are Associated with Lower Risk of Mortality" },
        { sourceKey: "decabo-mattson-2019", title: "Effects of Intermittent Fasting on Health, Aging, and Disease" },
      ],
      blocked: false,
    };
  }

  // Default: treat as knowledge question
  return composeKnowledgeAnswer(query, ctx);
}

/** Full pipeline: safety scan → route → compose → banned-claim scan. */
export function generateDemoReply(
  userMessage: string,
  history: AiMessage[],
  ctx: ComposerContext = {}
): ComposerResult {
  const safety = scanUserInput(userMessage);
  if (safety.flagged && safety.safeResponse) {
    return {
      reply: safety.safeResponse,
      labels: [{ label: "UNCERTAINTY", text: "Safety guardrail engaged — no medical guidance provided." }],
      sources: [],
      blocked: true,
    };
  }
  return composeUserDataAnswer(userMessage, ctx);
}

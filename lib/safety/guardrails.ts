// ─────────────────────────────────────────────────────────────
// Safety guardrails — pure functions, unit-tested.
// Implements docs/AI-SAFETY-RULES.md
// ─────────────────────────────────────────────────────────────

export type SafetyCategory = "medical_request" | "banned_claim" | "emergency" | null;

export interface SafetyScanResult {
  flagged: boolean;
  category: SafetyCategory;
  reason: string | null;
  safeResponse: string | null;
}

const EMERGENCY_PATTERNS: RegExp[] = [
  /chest pain/i,
  /can'?t breathe|difficulty breathing|shortness of breath/i,
  /(thoughts of )?(suicid\w+|self[- ]harm)/i,
  /stroke|heart attack right now/i,
  /severe bleeding|unconscious|seizure/i,
  /overdos\w+/i,
];

const DIAGNOSIS_PATTERNS: RegExp[] = [
  /do i have (diabetes|cancer|a disease|an?\s+\w+ condition|hypertension|heart disease)/i,
  /(what|which) (disease|illness|condition) do i have/i,
  /is this (lump|rash|pain|symptom) (cancer|serious|dangerous)/i,
  /diagnos\w+ me/i,
  /my (blood )?test results? (mean|show|say)s? i (have|am)/i,
];

const PRESCRIPTION_PATTERNS: RegExp[] = [
  /prescribe/i,
  /what (dose|dosage) (of|should)/i,
  /how (much|many) (mg|milligrams?|iu|ml)\b.*take/i,
  /should i take (metformin|statins?|aspirin|insulin|antidepressants?|antibiotics?|supplements?\s*\w*\s*for)/i,
  /which (drug|medication|medicine) (should|for)/i,
  /start (taking|on) \w+ (for|to)/i,
  /stop taking my (medication|medicine|prescription)/i,
];

const DOSAGE_PATTERNS: RegExp[] = [
  /\b\d+\s?(mg|mcg|iu|g)\b.*\b(per day|daily|every day|a day)\b/i,
  /how (much|many) (mg|milligrams?|mcg|iu|ml|pills|tablets|capsules)\b/i,
];

const BANNED_CLAIM_PATTERNS: RegExp[] = [
  /revers(e|ed|ing) (your |my |the )?(ageing|aging|biological age)/i,
  /reduc(e|ed|ing) (your |my |the )?biological age/i,
  /lower(ed)? (your |my |the )?biological age/i,
  /add(ed|ing)? \d+ years? (to|of) (your |my )?life/i,
  /added \d+ years/i,
  /extend(s|ed)? (your |my )?lifespan by/i,
  /predict(s|ed)? (your |my )?lifespan/i,
  /you will live to/i,
  /cures? (cancer|diabetes|alzheimer)/i,
  /guarantee(d|s)? .* (reversal|remission)/i,
];

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return null;
}

const EMERGENCY_RESPONSE =
  "This sounds urgent and I'm not able to help with medical emergencies. " +
  "If you or someone else may be in danger, please contact your local emergency services or go to the nearest emergency department right now. " +
  "Longevity Circle is an educational tool and cannot provide emergency or medical care.";

const MEDICAL_RESPONSE =
  "That's an important question, but it needs a qualified professional. Longevity Circle is an educational and wellness tool — it can't diagnose conditions, prescribe treatment, or advise on medications and dosages. " +
  "A doctor or licensed healthcare provider can assess your history properly. " +
  "In the meantime, I can help with general, evidence-based education: for example, what research says about sleep, movement, nutrition patterns, or stress — and how to design a safe self-experiment around lifestyle habits.";

/** Scan user input (AI chat message or community post) for unsafe requests. */
export function scanUserInput(text: string): SafetyScanResult {
  if (firstMatch(text, EMERGENCY_PATTERNS)) {
    return { flagged: true, category: "emergency", reason: "possible emergency", safeResponse: EMERGENCY_RESPONSE };
  }
  if (firstMatch(text, PRESCRIPTION_PATTERNS) || firstMatch(text, DOSAGE_PATTERNS)) {
    return {
      flagged: true, category: "medical_request", reason: "requests prescription or dosage advice",
      safeResponse: MEDICAL_RESPONSE,
    };
  }
  if (firstMatch(text, DIAGNOSIS_PATTERNS)) {
    return {
      flagged: true, category: "medical_request", reason: "requests diagnosis",
      safeResponse: MEDICAL_RESPONSE,
    };
  }
  return { flagged: false, category: null, reason: null, safeResponse: null };
}

/** Scan generated content (AI output, reports, marketing copy) for banned claims. */
export function scanBannedClaims(text: string): SafetyScanResult {
  const hit = firstMatch(text, BANNED_CLAIM_PATTERNS);
  if (hit) {
    return {
      flagged: true,
      category: "banned_claim",
      reason: `banned claim detected: "${hit}"`,
      safeResponse: null,
    };
  }
  return { flagged: false, category: null, reason: null, safeResponse: null };
}

/** Convenience: check any text for any safety issue. */
export function scanText(text: string): SafetyScanResult {
  return scanUserInput(text).flagged ? scanUserInput(text) : scanBannedClaims(text);
}

// ── Professional-consultation nudges ─────────────────────────

export interface ConsultNudge {
  show: boolean;
  reason: string | null;
}

/** Decide when to show the "discuss with a qualified professional" nudge. */
export function consultNudge(context: {
  hasOutOfRangeValue?: boolean;
  clinicalTopic?: boolean;
  notableReportChange?: boolean;
  userAskedAboutSymptoms?: boolean;
}): ConsultNudge {
  if (context.hasOutOfRangeValue) return { show: true, reason: "A confirmed value falls outside its educational reference range." };
  if (context.clinicalTopic) return { show: true, reason: "This topic touches clinical biomarkers — a professional can interpret them in context." };
  if (context.notableReportChange) return { show: true, reason: "Your report shows notable changes worth discussing professionally." };
  if (context.userAskedAboutSymptoms) return { show: true, reason: "Symptoms deserve proper assessment by a qualified professional." };
  return { show: false, reason: null };
}

// ── Non-diagnostic labelling helpers ──────────────────────────

export const BASELINE_LABEL = "Personal baseline — not a medical assessment.";
export const WELLNESS_INDICATOR_LABEL = "Self-reported wellness indicators — not medical scores.";

export function classifyValue(value: number, low: number | null, high: number | null): "in-range" | "out-of-range" | "no-range" {
  if (low === null || high === null) return "no-range";
  if (value < low || value > high) return "out-of-range";
  return "in-range";
}

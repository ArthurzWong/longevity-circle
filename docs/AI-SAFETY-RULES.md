# AI & Content Safety Rules

Enforced in `lib/safety/guardrails.ts` (pure functions, unit-tested). Every AI response path — demo composer and server proxy — passes through the same guard.

## 1. Claim labelling

Every evidential statement produced by Longevity AI is labelled one of:

| Label | Meaning |
|---|---|
| `FACT` | Definitional / universally accepted (e.g., "sleep is essential for recovery") |
| `RESEARCH FINDING` | Comes from a cited study/meta-analysis in retrieved context |
| `EXPERT OPINION` | Attribution to a named expert's perspective |
| `USER DATA` | Restatement of the user's own tracked data |
| `UNCERTAINTY` | Explicit open question / limits of evidence |

The demo composer emits these labels structurally; the server prompt requires them; tests assert presence.

## 2. Response format

ANSWER → WHAT THE EVIDENCE SAYS → WHAT IS UNCERTAIN → HOW THIS MAY RELATE TO YOU → POSSIBLE NEXT STEP → WHEN TO CONSULT A PROFESSIONAL → SOURCES.

## 3. Citation integrity

- Only `source_id`s from retrieved context may be cited.
- Orphan citations are stripped and logged.
- If no source supports a claim, it must be labelled `UNCERTAINTY` or omitted.
- Never fabricate authors, titles, URLs, or publication dates.

## 4. Banned claims

Never output (in AI, reports, or marketing copy):

- "you reversed ageing" / "reversed your biological age"
- "you reduced your biological age"
- "you added X years to your life"
- any lifespan/death prediction
- disease diagnosis ("you have …"), treatment prescription, dosage advice

The safety scanner flags these patterns; AI output containing them is blocked and replaced with a safe reformulation.

## 5. Medical-request handling

When user input (AI chat or community post) matches diagnosis / prescription / dosage / emergency patterns:

1. Acknowledge without providing medical advice.
2. Give safe, general educational guidance.
3. Encourage consultation with a qualified professional (emergency services if emergency pattern).

Test cases cover: chest-pain emergency, "what dose should I take", "do I have diabetes", "prescribe me…".

## 6. Health Data Vault rules

- Extraction ≠ confirmation. Unconfirmed items show a pending badge and never enter the confirmed dataset.
- Reference ranges are displayed educationally with a non-diagnostic banner; out-of-range values show "discuss with a professional", never an interpretation.
- No automatic unit conversion when uncertain.

## 7. Scoring rules

- No biological-age score. No disease-risk scores.
- Allowed: Personal Baseline (self-reported), Trend, Consistency, Experiment Progress — always labelled "self-reported wellness indicators, not medical scores."

## 8. Community safety

Post composer runs the same medical-request scanner; flagged posts get a safety banner and an educational redirect. Admin sees flagged content in `/admin`.

## 9. Professional-consultation nudges

Triggered when: user views out-of-range lab values, AI answers touch clinical biomarkers, monthly report contains notable changes, or user asks about symptoms.

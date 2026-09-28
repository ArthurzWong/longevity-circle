# Longevity Circle — Product Requirements Document

**Version:** 0.1 (MVP) · **Status:** Implemented (Phase 1 + demo slices of Phase 2) · **Codename:** `longevity-circle`

---

## 1. Vision

Transform longevity education into **personalised, evidence-aware action**.

Longevity Circle is **not** another generic fitness tracker or biological-age calculator. It is a guided loop:

> **LEARN → ASSESS → EXPERIMENT → TRACK → REFLECT → CONNECT**

Users learn what the evidence actually says, assess their own self-reported baseline, run small self-experiments, track what changes, reflect with AI support, and connect with experts and community.

## 2. Target users

| Segment | Need |
|---|---|
| Health-conscious adults 35+ | Trusted, non-hyped guidance |
| Creators Circle attendees | Content from experts they've seen, structured & searchable |
| Longevity / wellness enthusiasts | Structured self-experiments, not random biohacking |
| Coaches & practitioners | Shareable educational content, client-friendly language |
| Corporate wellness programmes | Safe, non-diagnostic, education-first tooling |

## 3. Safety position (non-negotiable)

- Educational & wellness product. **Never** diagnose disease, prescribe treatment, predict lifespan, or replace a doctor.
- Biomarker information is presented as **education**, never as diagnosis.
- When content touches medical territory, the app shows a professional-consultation nudge.
- The AI must label every statement as one of: `FACT`, `RESEARCH FINDING`, `EXPERT OPINION`, `USER DATA`, `UNCERTAINTY`.
- No "biological age" score. Ever. We compute **Personal Baseline, Trend, Consistency, Experiment Progress** — all labelled *"self-reported wellness indicators, not medical scores."*
- Never silently convert uncertain document extractions into conclusions; user confirmation gates all data entry from documents.
- Community/AI safety filters detect requests for diagnosis, prescriptions, dosage, or emergencies and respond with safe educational guidance + professional-care encouragement.

## 4. Core loops

1. **Learn** — Evidence Explorer answers longevity questions with source-linked, evidence-graded briefs.
2. **Assess** — Onboarding + Longevity Profile capture a self-reported baseline across six domains.
3. **Experiment** — Users create time-boxed experiments with protocol, metrics, baseline and daily check-ins.
4. **Track** — Dashboard aggregates priorities, running experiments, insights, and upcoming check-ins.
5. **Reflect** — Monthly reports + AI conversations turn raw tracking into reflections and "questions for your professional."
6. **Connect** — Expert Circle content and community circles for educational discussion.

## 5. Screens (Phase 1 scope)

| # | Screen | Route | Purpose |
|---|---|---|---|
| 1 | Landing | `/` | Hero "Live Better. Stay Capable. Keep Evolving." + CTAs |
| 2 | Onboarding | `/onboarding` | 6-step flow: age range, sex, goals, activity, sleep, nutrition, stress, interests, wearables, language |
| 3 | Longevity Profile | `/profile` | Six domains (MOVE/THINK/RESTORE/FUEL/CONNECT/MEASURE), baseline indicators, explicit non-medical label |
| 4 | Dashboard | `/dashboard` | Today's priorities, current experiments, recent insights, upcoming check-in, circle activity |
| 5 | Evidence Explorer | `/explore` | Search longevity questions → structured evidence briefs with citations |
| 6 | Longevity AI | `/ai` | Conversational interface with evidence-label discipline and suggested prompts |
| 7 | Experiments | `/experiments` | Library + create wizard (title, goal, duration, protocol, metrics, baseline, check-ins, result, reflection) |
| 8 | Health Data Vault | `/vault` | Upload PDF/CSV/image → extract → **user confirms** → enters personal dataset |
| 9 | Expert Circle | `/circle` | Expert profiles, content library, AI knowledge cards, FAQs, takeaways, discussion questions |
| 10 | Community | `/community` | Topic circles, educational posts, safety-guarded composer |
| 11 | Monthly Report | `/reports` | What changed, experiments completed, habit trends, reflections, questions for professional, next focus |
| 12 | Creator Studio | `/studio` | Upload → transcribe → chunk → embed → index → insights → knowledge cards / FAQ / discussion questions / experiment ideas |
| 13 | Admin | `/admin` | Users, experts, content, sources, experiments, circles, flagged content |
| 14 | Settings/Privacy | `/settings` | Data export, delete account/data, consent, private-by-default toggle |

## 6. Functional requirements

### 6.1 Evidence Explorer
- Query over the knowledge base (keyword + semantic-lite scoring; pgvector-ready).
- Returns per question: short answer, evidence strength (Strong/Moderate/Emerging/Mixed), what studies show, what remains uncertain, population/context, potential benefits, potential risks, expert perspectives, sources.
- Every claim stores source metadata (`research_sources`, `citations`).

### 6.2 Longevity AI
- Suggested prompts: explain sleep pattern, create 14-day experiment, explain a health report, compare claims, what to focus on first, what did this expert say.
- Response structure: ANSWER → WHAT THE EVIDENCE SAYS → WHAT IS UNCERTAIN → HOW THIS MAY RELATE TO YOU → POSSIBLE NEXT STEP → WHEN TO CONSULT A PROFESSIONAL → SOURCES.
- Abstraction layer (`lib/ai/`) so the LLM provider can be swapped: demo (rule-based, grounded in seed knowledge) or server proxy (`/api/ai/chat` → OpenAI/Anthropic) with RAG context injection.
- Never fabricates citations; only cites retrieved sources with IDs.

### 6.3 Experiments
- Library of seed experiments (sleep, walking, strength, meditation, caffeine timing, nutrition habit, mobility).
- Lifecycle: `draft → active → completed`, with daily check-ins (1–5 scale + note).
- Progress = check-in consistency, never a medical claim.

### 6.4 Health Data Vault
- Upload PDF/CSV/image → **demo extraction** (parse known patterns) → structured proposal (document type, date, measurements, units, reference ranges).
- Unconfirmed extractions are visually flagged and never enter the personal dataset until the user confirms.
- Reference ranges displayed for education with a non-diagnostic banner.

### 6.5 Community safety
- Composer + display flags posts matching diagnosis/prescription/dosage/emergency patterns; redirects to safe educational framing and professional care.

### 6.6 Monthly Report
- Generated from user data: what changed, experiments completed, habit trends, personal reflections, **questions for professional discussion**, next month's focus.
- Banned claims (no "reversed ageing", "reduced biological age", "added X years") enforced by copy + safety filter.

## 7. Scoring model

| Signal | Definition | Labelling |
|---|---|---|
| Personal Baseline | Self-reported 1–5 per domain at onboarding | "Personal baseline — not a medical assessment." |
| Trend | Direction of check-in/measurements over 30 days | "self-reported trend" |
| Consistency | % of scheduled check-ins completed | neutral |
| Experiment Progress | % complete of active experiments | neutral |

## 8. Privacy & trust

- Minimum data collection; no sensitive extras (no conditions, medications, diagnoses asked).
- Explicit consent checkbox at onboarding; settings page offers **data export (JSON download)** and **delete all data**.
- Profiles private by default; role-based access (`user`, `expert`, `admin`); audit log for sensitive actions; storage encrypted at rest by Supabase.

## 9. Non-functional

- Mobile-first responsive; premium editorial aesthetic (calm, sophisticated; not clinical, not biohacker, not medical dashboard).
- TypeScript end-to-end; strict mode.
- Provider abstraction for data (demo/supabase) and AI (demo/openai/anthropic).
- Vercel-compatible; static-export compatible for demo hosting.

## 10. Roadmap

- **Phase 1 (done in this MVP):** Landing, Onboarding, Profile, Dashboard, Evidence Explorer, Longevity AI, Experiments, Health Data Vault, Expert Circle, Community, Reports, Studio, Admin, Settings.
- **Phase 2:** Wearables integrations, full transcription pipeline (Deepgram/Whisper), realtime community, push notifications, i18n.
- **Phase 3:** Practitioner portal, corporate programmes, partner integrations, Malaysia/SEA ecosystem (language, payment, local experts).

## 11. Success metrics (proposal)

- % of onboarded users who start ≥1 experiment in 7 days
- Check-in consistency ≥3 days/week per active experiment
- Evidence Explorer query → saved insight conversion
- AI conversations that cite ≥1 source
- 30-day retention of experiment completers vs non-completers

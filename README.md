# Longevity Circle

**Live Better. Stay Capable. Keep Evolving.**

A mobile-first web application that transforms longevity education into personalised, evidence-aware action — built around one loop:

> **LEARN → ASSESS → EXPERIMENT → TRACK → REFLECT → CONNECT**

Not another fitness tracker. Not a biological-age calculator. An educational, safety-first longevity companion.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

The app runs fully in **demo mode** with zero configuration — data persists in `localStorage`, and Longevity AI uses a rule-based composer grounded in a seeded evidence base.

### Demo account

The demo sign-in is automatic: open `/dashboard` (or any user screen) and a demo session is created as **Arthur** (admin role) — no credentials needed. To reset, use **Settings → Delete all my data** or clear site data.

### Commands

```bash
npm run dev         # dev server
npm run build       # production build (server, API routes included) — Vercel-ready
npm run build:static# static export for plain static hosting (API routes staged out)
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest (safety, RAG, extraction suites)
```

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn-style UI primitives |
| Backend | Next.js API routes (`/api/ai/chat` LLM proxy) |
| Database | Supabase / PostgreSQL (`supabase/migrations/`) |
| Auth | Supabase Auth (+ demo session provider for zero-config demos) |
| Storage | Supabase Storage (health documents) |
| Vector/RAG | pgvector + `match_knowledge_chunks` RPC; demo-mode lexical retrieval |
| AI | Provider abstraction: `demo` / `openai` / `anthropic` via `LLM_PROVIDER` |
| Deployment | Vercel (server build) or any static host (static export) |

## Design

Premium editorial health-tech: warm paper tones, sage/ink/gold palette, serif display type, calm and sophisticated — deliberately **not** clinical, not a medical dashboard, not biohacker neon.

## Documentation

| Doc | Purpose |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Product requirements, users, loops, scoring & safety model |
| [docs/ROUTE-MAP.md](docs/ROUTE-MAP.md) | Every screen + API route |
| [docs/RAG-ARCHITECTURE.md](docs/RAG-ARCHITECTURE.md) | Source types, chunk schema, retrieval & citation contract |
| [docs/AI-SAFETY-RULES.md](docs/AI-SAFETY-RULES.md) | Claim labelling, banned claims, medical-request handling |
| [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) | Full schema — 24 tables + RLS |
| [supabase/migrations/0002_rag.sql](supabase/migrations/0002_rag.sql) | pgvector knowledge_chunks + match RPC |
| [.env.example](.env.example) | Every toggle (demo needs none of them) |

## Screens (Phase 1 + demo Phase 2)

Landing · Onboarding (6 steps + consent) · Longevity Profile (6 domains) · Dashboard · Evidence Explorer (10 evidence cards) · Longevity AI (labelled, cited answers) · Experiments (templates + create + check-ins + reflection) · Health Data Vault (upload → extract → **you confirm**) · Expert Circle (5 DEMO experts + AI knowledge cards) · Community (5 circles + safety-flagged composer) · Monthly Reports · Creator Studio (10-stage pipeline demo) · Admin · Settings (export / delete / consent).

## Safety model (the short version)

- Educational wellness tool — **never** diagnoses, prescribes, or predicts lifespan.
- AI statements labelled `FACT` / `RESEARCH FINDING` / `EXPERT OPINION` / `USER DATA` / `UNCERTAINTY`.
- Answers follow the fixed contract: ANSWER → WHAT THE EVIDENCE SAYS → WHAT IS UNCERTAIN → HOW THIS MAY RELATE TO YOU → POSSIBLE NEXT STEP → WHEN TO CONSULT A PROFESSIONAL → SOURCES.
- No fabricated citations — every cited key resolves to a stored source (unit-tested).
- No biological-age score. Baselines labelled *"Personal baseline — not a medical assessment."*
- Document extractions enter your dataset **only after you confirm them**.
- Community posts and AI chat are scanned for diagnosis/prescription/dosage/emergency requests; flagged content is redirected to professional care.
- Private by default · data export · delete everything · audit logs (schema).

## Seed content (all labelled DEMO)

10 evidence cards · 10 real public research sources · 10 longevity questions · 5 fictional experts · 5 circles · 7 experiment templates · 3 monthly reports · 21 knowledge chunks.

## License

Private project. All expert content is fictional demo material; no real doctors' names, photographs, or endorsements are used.

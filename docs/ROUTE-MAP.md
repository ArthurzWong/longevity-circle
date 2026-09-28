# Route Map

## Pages (App Router)

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/` | Landing | public | Hero + 2 CTAs |
| `/onboarding` | Onboarding wizard | public (demo) | 6 steps, consent gate |
| `/profile` | Longevity Profile | user | Six domains, baseline indicators |
| `/dashboard` | Dashboard | user | Priorities, experiments, insights, check-in, circle activity |
| `/explore` | Evidence Explorer | public | Search + question cards; detail expands inline |
| `/ai` | Longevity AI | user | Chat with evidence labelling |
| `/experiments` | Experiments hub | user | Library + create wizard + tracker |
| `/vault` | Health Data Vault | user | Upload → extract → confirm |
| `/circle` | Expert Circle | public | Experts + content + AI knowledge cards |
| `/community` | Community circles | user | Posts, safety-guarded composer |
| `/reports` | Monthly reports | user | Generated monthly summaries |
| `/studio` | Creator Studio | expert/admin | Pipeline visualiser + run |
| `/admin` | Admin console | admin | Users, experts, content, sources, experiments, circles, flagged |
| `/settings` | Privacy & settings | user | Export, delete, consent |

In demo mode, "auth" is simulated via a demo session in localStorage (`longevity-circle:demo-session`).

## API routes (server build only — excluded from static export)

| Route | Method | Purpose |
|---|---|---|
| `/api/ai/chat` | POST | LLM proxy. Body: `{ messages, context? }`. Uses `lib/ai/server.ts` provider registry (`demo`/`openai`/`anthropic`), RAG context from `lib/rag/retrieval.ts`. Keys stay server-side. |

## Data provider abstraction

`lib/data/provider.ts` resolves `NEXT_PUBLIC_DATA_PROVIDER`:
- `demo` → `lib/data/demo-provider.ts` (localStorage, seeded from `lib/seed/`)
- `supabase` → `lib/data/supabase-provider.ts` (stub wired to `@supabase/supabase-js`; implements the same `DataProvider` interface)

## Navigation shell

Bottom tab bar (mobile-first): HOME · EXPLORE · AI · EXPERIMENTS · CIRCLE · PROFILE — per brief. Secondary destinations (Vault, Community, Reports, Studio, Admin, Settings) reachable from Profile and Dashboard.

# Component Architecture

## Layout

```
app/layout.tsx                 Root: fonts, metadata, global paper background
components/app-shell.tsx       Mobile-first shell + bottom tab bar (HOME·EXPLORE·AI·EXPERIMENTS·CIRCLE·PROFILE)
```

## Primitives (shadcn-style, `components/ui/`)

| Component | Notes |
|---|---|
| `Button` | cva variants: primary / secondary / outline / ghost / danger |
| `Card` (+Header/Title/Description/Content/Footer) | soft shadow, parchment borders |
| `Badge` | default / gold / outline / warn / muted / **demo** |
| `Input`, `Textarea`, `Label`, `OptionGrid` | OptionGrid = segmented picker (single/multi) used across onboarding & forms |

## Shared composites (`components/shared.tsx`)

| Component | Purpose |
|---|---|
| `SafetyBanner` | Sage (info) / clay (caution) educational-safety callout |
| `PageHeader` | eyebrow + title + subtitle |
| `EvidenceStrengthBadge` | strong→sage, moderate→gold, mixed→warn, emerging→outline |
| `DemoBadge` | DEMO label for fictional experts/content |
| `LabelledText` | Renders AI prose with section styling |

## Page containers (`app/**/page.tsx`)

All screens are client components talking to the `DataProvider` abstraction — no page imports a concrete provider.

```
Landing (RSC) ── static hero + loop + is/isn't
Onboarding ──── 6-step wizard state machine → saveOnboarding()
Profile ─────── domain baselines grid + secondary nav
Dashboard ───── priorities (derived) + experiments + insights + circle rail + check-in sheet
Explore ─────── search box → searchEvidenceCards() → expandable evidence cards
AI ──────────── chat state → sendChat() (client abstraction) → labelled bubbles
Experiments ─── hub / create / detail views + check-in + reflection
Vault ───────── upload → extractDocument() → review modal → confirmed dataset
Circle ──────── expert grid → profile + content + generate knowledge cards
Community ───── circle chips + composer (live scanUserInput feedback) + flagged banner
Reports ─────── accordion of monthly reports
Studio ──────── 10-stage pipeline visual + demo runner
Admin ──────── tabbed console over seed registries
Settings ───── visibility toggle, JSON export, guarded delete
```

## Service layer

```
lib/types.ts .................. DataProvider contract (the seam)
lib/data/provider.ts .......... resolver: demo ⇄ supabase (env switch)
lib/data/demo-provider.ts ..... localStorage implementation + extractDocument()
lib/data/supabase-provider.ts .. Supabase implementation (session/profile live; CRUD documented)
lib/ai/client.ts .............. browser AI abstraction: demo ⇄ /api/ai/chat
lib/ai/composer.ts ............ rule-based composer (labels, citations, safety)
lib/ai/server.ts .............. server registry: demo | openai | anthropic + RAG injection
lib/rag/retrieval.ts .......... retrieval interface (lexical demo ⇄ pgvector server)
lib/safety/guardrails.ts ...... pure safety functions (shared by AI + community + vault)
lib/seed/ ..................... knowledge.ts (sources/cards/chunks), data.ts (experts, templates, demo user data)
```

## Data flow example — a check-in

```
Dashboard sheet (rating 1–5 + note)
  → DataProvider.addCheckin(expId, {day, rating, note})
  → DemoDataProvider writes localStorage (Supabase provider would upsert experiment_checkins; RLS enforces ownership)
  → refresh() re-reads experiments → progress bar + consistency recompute
```

## Design tokens

Tailwind palette: `paper/parchment/mist` surfaces, `ink` text, `sage` primary, `gold` accent, `clay` warnings; `font-display` serif for editorial headings; shadows `card`/`lift`; radii `xl/2xl`.

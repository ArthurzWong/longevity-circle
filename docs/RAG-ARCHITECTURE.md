# RAG Architecture

## Goals

Source-aware research: every AI statement about evidence is grounded in retrievable chunks that retain full provenance. **Never fabricate citations.**

## Source types

| source_type | Examples |
|---|---|
| `who` | WHO physical-activity guidance |
| `peer-reviewed` | Randomised trials, meta-analyses |
| `government` | National health agencies |
| `university` | Academic public health material |
| `expert-authored` | Articles by platform experts |
| `expert-interview` | Interview transcripts |
| `creator` | Creator Studio uploads (labelled DEMO in seed) |

## Chunk schema

Every chunk stored in `knowledge_chunks` (pgvector) retains:

```
source_id, title, author, publication_date, source_type, url,
chunk_index, content, claim, evidence_level, population, context,
embedding vector(1536), retrieved_at
```

`evidence_level` ∈ `meta-analysis | rct | cohort | cross-sectional | mechanistic | expert-opinion | demo`.

## Retrieval flow

```
user question
  → normalise + extract key terms (lib/rag/retrieval.ts)
  → hybrid score:
       · semantic: cosine over embedding (pgvector `match_knowledge_chunks`
         server-side; local lexical scoring in demo mode)
       · lexical: token overlap over claim/content/tags
  → top-K chunks (default K=8, min evidence diversity: at least one
    non-expert-opinion chunk when available)
  → assemble context blocks with full metadata
  → inject into LLM prompt (server) or rule-based composer (demo)
  → response must cite chunk source_ids that exist in the context
```

## Demo mode

`lib/rag/retrieval.ts` scores the seed knowledge chunks in `lib/seed/knowledge.ts` with a transparent lexical scorer (token overlap + field weights). Same interface as the server path, so swapping to pgvector later changes one module.

## Server path (Supabase + pgvector)

Migration `supabase/migrations/0002_rag.sql` creates:
- `vector(1536)` column (text-embedding-3-small dimension; configurable)
- `match_knowledge_chunks(query_embedding, match_count, min_similarity)` RPC
- HNSW index

Embedding generation is delegated to the configured LLM provider's embedding endpoint (abstraction in `lib/ai/server.ts`); the MVP ships the schema + retrieval contract, with the embedding call stubbed behind the same interface.

## Citation contract

- The AI composer may only cite `source_id`s present in retrieved context.
- `citations` table links `ai_messages` / `evidence cards` to `research_sources`.
- Demo composer and tests enforce: every citation must resolve to a known source; orphan citations fail the test suite.

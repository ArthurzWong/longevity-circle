-- ═══════════════════════════════════════════════════════════════
-- Longevity Circle — 0002_rag.sql
-- pgvector-backed retrieval for the Evidence Explorer & Longevity AI.
-- ═══════════════════════════════════════════════════════════════

create extension if not exists vector;

create table knowledge_chunks (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references research_sources(id) on delete cascade,
  chunk_index int not null default 0,
  title text not null,                -- denormalised from source for retrieval context
  author text not null default '',
  publication_date date,
  source_type source_type not null,
  url text,
  claim text not null default '',
  evidence_level evidence_level,
  population text,
  context text,
  content text not null,
  tags text[] not null default '{}',
  embedding vector(1536),             -- text-embedding-3-small dimension (configurable)
  retrieved_at timestamptz not null default now()
);

create index knowledge_chunks_source_idx on knowledge_chunks(source_id);
create index knowledge_chunks_hnsw on knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

-- Semantic match RPC used by /api/ai/chat and the Evidence Explorer server path.
create or replace function match_knowledge_chunks(
  query_embedding vector(1536),
  match_count int default 8,
  min_similarity float default 0.20
)
returns table (
  chunk_id uuid,
  source_id uuid,
  title text,
  author text,
  publication_date date,
  source_type source_type,
  url text,
  claim text,
  evidence_level evidence_level,
  population text,
  context text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    kc.id,
    kc.source_id,
    kc.title,
    kc.author,
    kc.publication_date,
    kc.source_type,
    kc.url,
    kc.claim,
    kc.evidence_level,
    kc.population,
    kc.context,
    kc.content,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  where kc.embedding is not null
    and 1 - (kc.embedding <=> query_embedding) >= min_similarity
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

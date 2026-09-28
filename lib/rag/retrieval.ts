// ─────────────────────────────────────────────────────────────
// Demo RAG retrieval — transparent lexical scoring over the seed
// knowledge chunks. Same interface as the server pgvector path.
// ─────────────────────────────────────────────────────────────

import { seedChunks, seedSources, seedEvidenceCards } from "@/lib/seed/knowledge";
import type { EvidenceCard, KnowledgeChunk, ResearchSource } from "@/lib/types";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "of", "for", "to", "in", "on",
  "and", "or", "my", "i", "me", "can", "should", "what", "how", "much", "many",
  "it", "be", "with", "as", "at", "by", "from", "that", "this", "really", "truly",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
}

export interface RetrievedContext {
  chunks: ScoredChunk[];
  sources: ResearchSource[];
  query: string;
}

/** Field-weighted lexical scoring: claim ×3, tags ×2, title ×2, content ×1. */
export function scoreChunks(query: string, chunks: KnowledgeChunk[]): ScoredChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = chunks.map((chunk) => {
    let score = 0;
    const claimTokens = new Set(tokenize(chunk.claim));
    const titleTokens = new Set(tokenize(chunk.title));
    const tagTokens = new Set(chunk.tags.map((t) => t.toLowerCase()));
    const contentTokens = new Set(tokenize(chunk.content));

    for (const t of tokens) {
      if (claimTokens.has(t)) score += 3;
      if (tagTokens.has(t)) score += 2;
      if (titleTokens.has(t)) score += 2;
      if (contentTokens.has(t)) score += 1;
    }
    return { chunk, score };
  });

  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

/** Retrieve top-K chunks + their sources for a query (demo path). */
export function retrieve(query: string, k = 8): RetrievedContext {
  const scored = scoreChunks(query, seedChunks).slice(0, k);
  const sourceIds = new Set(scored.map((s) => s.chunk.sourceId));
  const sources = seedSources.filter((s) => sourceIds.has(s.id));
  return { chunks: scored, sources, query };
}

/** Evidence Explorer search: match evidence cards by question/tags/content. */
export function searchEvidenceCards(query: string): EvidenceCard[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return seedEvidenceCards;

  const scored = seedEvidenceCards.map((card) => {
    let score = 0;
    const q = new Set(tokenize(card.question));
    const tags = new Set(card.tags);
    const shortA = new Set(tokenize(card.shortAnswer));
    const body = new Set(tokenize(card.whatStudiesShow + " " + card.whatRemainsUncertain));

    for (const t of tokens) {
      if (q.has(t)) score += 4;
      if (tags.has(t)) score += 3;
      if (shortA.has(t)) score += 2;
      if (body.has(t)) score += 1;
    }
    return { card, score };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return hits.length > 0 ? hits.map((h) => h.card) : [];
}

export function getEvidenceCardById(id: string): EvidenceCard | undefined {
  return seedEvidenceCards.find((c) => c.id === id);
}

export function sourceByKey(key: string): ResearchSource | undefined {
  return seedSources.find((s) => s.sourceKey === key);
}

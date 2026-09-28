import { describe, it, expect } from "vitest";
import { retrieve, searchEvidenceCards, scoreChunks, sourceByKey } from "@/lib/rag/retrieval";
import { seedChunks, seedEvidenceCards, seedSources } from "@/lib/seed/knowledge";
import { composeKnowledgeAnswer, generateDemoReply } from "@/lib/ai/composer";

describe("seed data integrity", () => {
  it("has 10 evidence cards, 10 sources, and chunks with full metadata", () => {
    expect(seedEvidenceCards.length).toBe(10);
    expect(seedSources.length).toBe(10);
    expect(seedChunks.length).toBeGreaterThanOrEqual(15);
    for (const c of seedChunks) {
      expect(c.sourceId).toBeTruthy();
      expect(c.claim.length).toBeGreaterThan(10);
      expect(c.content.length).toBeGreaterThan(50);
      expect(c.sourceType).toBeTruthy();
    }
  });

  it("every evidence card cites known sources", () => {
    const keys = new Set(seedSources.map((s) => s.sourceKey));
    for (const card of seedEvidenceCards) {
      expect(card.sourceKeys.length).toBeGreaterThan(0);
      for (const k of card.sourceKeys) expect(keys.has(k)).toBe(true);
    }
  });

  it("source keys resolve", () => {
    expect(sourceByKey("who-pa-2020")?.sourceType).toBe("who");
    expect(sourceByKey("nonexistent-key")).toBeUndefined();
  });
});

describe("retrieval", () => {
  it("scores fasting question above zero and ranks the fasting chunk first", () => {
    const { chunks } = retrieve("Does fasting improve longevity?");
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].chunk.tags).toContain("fasting");
  });

  it("returns empty for gibberish", () => {
    expect(scoreChunks("xzqjkw vvbbnm", seedChunks)).toHaveLength(0);
  });

  it("evidence search finds sleep card", () => {
    const hits = searchEvidenceCards("how much sleep");
    expect(hits[0].id).toBe("ev-sleep-duration");
  });
});

describe("AI composer — structured, labelled, cited", () => {
  it("produces all seven required sections", () => {
    const r = composeKnowledgeAnswer("Does strength training extend healthspan?");
    for (const section of [
      "**ANSWER**",
      "**WHAT THE EVIDENCE SAYS**",
      "**WHAT IS UNCERTAIN**",
      "**HOW THIS MAY RELATE TO YOU**",
      "**POSSIBLE NEXT STEP**",
      "**WHEN TO CONSULT A PROFESSIONAL**",
      "**SOURCES**",
    ]) {
      expect(r.reply).toContain(section);
    }
  });

  it("labels statements with evidence categories", () => {
    const r = composeKnowledgeAnswer("is coffee good or bad?");
    const labels = r.labels.map((l) => l.label);
    expect(labels).toContain("RESEARCH FINDING");
    expect(labels).toContain("UNCERTAINTY");
  });

  it("never emits orphan citations — every cited key exists in sources", () => {
    const r = composeKnowledgeAnswer("does meditation reduce stress?");
    for (const s of r.sources) {
      expect(sourceByKey(s.sourceKey)).toBeDefined();
    }
  });

  it("honestly declines unknown topics without fabricating", () => {
    const r = composeKnowledgeAnswer("quantum telomere resonance crystals?");
    expect(r.reply).toContain("don't have evidence");
    expect(r.sources).toHaveLength(0);
  });

  it("safety-scans user messages before answering", () => {
    const r = generateDemoReply("What dose of metformin should I take?", []);
    expect(r.blocked).toBe(true);
    expect(r.reply).toMatch(/qualified professional/i);
  });
});

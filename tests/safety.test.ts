import { describe, it, expect } from "vitest";
import { scanUserInput, scanBannedClaims, classifyValue, consultNudge } from "@/lib/safety/guardrails";

describe("safety guardrails — user input scanning", () => {
  it("flags emergency patterns with emergency response", () => {
    const r = scanUserInput("I have crushing chest pain right now");
    expect(r.flagged).toBe(true);
    expect(r.category).toBe("emergency");
    expect(r.safeResponse).toMatch(/emergency services/i);
  });

  it("flags diagnosis requests", () => {
    for (const msg of [
      "Do I have diabetes? My fasting glucose is 6.8",
      "Is this lump cancer?",
      "Can you diagnose me from these results?",
    ]) {
      const r = scanUserInput(msg);
      expect(r.flagged).toBe(true);
      expect(r.category).toBe("medical_request");
    }
  });

  it("flags prescription and dosage requests", () => {
    for (const msg of [
      "What dose of metformin should I take?",
      "Prescribe me something for sleep",
      "How many mg of melatonin per day?",
      "Should I take statins for my cholesterol?",
    ]) {
      const r = scanUserInput(msg);
      expect(r.flagged).toBe(true);
      expect(r.category).toBe("medical_request");
    }
  });

  it("allows ordinary educational questions", () => {
    for (const msg of [
      "Does fasting improve longevity?",
      "How much sleep do I need?",
      "Explain my recent sleep pattern",
      "Create a 14-day experiment for morning walks",
    ]) {
      expect(scanUserInput(msg).flagged).toBe(false);
    }
  });
});

describe("safety guardrails — banned claims in generated content", () => {
  it("blocks biological-age and lifespan claims", () => {
    for (const text of [
      "Congratulations — you reversed ageing this month!",
      "This plan will reduce your biological age by 4 years.",
      "You added 10 years to your life!",
      "I can predict your lifespan from these markers.",
    ]) {
      expect(scanBannedClaims(text).flagged).toBe(true);
      expect(scanBannedClaims(text).category).toBe("banned_claim");
    }
  });

  it("allows honest educational framing", () => {
    expect(scanBannedClaims("Sleep quality averaged 3.7/5, up from 3.2 last month.").flagged).toBe(false);
    expect(scanBannedClaims("Consistency improved across 11 of 14 days.").flagged).toBe(false);
  });
});

describe("reference-range classification (educational, non-diagnostic)", () => {
  it("classifies in-range, out-of-range, and no-range values", () => {
    expect(classifyValue(5.0, 3.9, 5.5)).toBe("in-range");
    expect(classifyValue(6.1, 3.9, 5.5)).toBe("out-of-range");
    expect(classifyValue(72, null, null)).toBe("no-range");
  });

  it("nudges professional consultation for out-of-range values only", () => {
    expect(consultNudge({ hasOutOfRangeValue: true }).show).toBe(true);
    expect(consultNudge({}).show).toBe(false);
  });
});

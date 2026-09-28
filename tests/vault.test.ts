import { describe, it, expect } from "vitest";
import { extractDocument } from "@/lib/data/demo-provider";
import type { HealthDocument } from "@/lib/types";

// The demo provider touches localStorage/window; extractDocument is pure,
// so provider-level persistence is smoke-tested via extractDocument here and
// provider wiring is exercised in the browser demo account verification.
describe("demo document extraction (proposal-only, never auto-confirmed)", () => {
  const run = (text: string, filename: string): HealthDocument["extraction"] => extractDocument(text, filename);

  it("extracts known lab patterns with units and educational reference ranges", () => {
    const ex = run("LAB REPORT 2026-09-15\nHDL: 1.4\nLDL 3.1\nHbA1c = 5.4\nFasting Glucose: 5.2", "lab-panel.txt");
    expect(ex).not.toBeNull();
    expect(ex!.documentType).toBe("lab_report");
    expect(ex!.date).toBe("2026-09-15");
    const names = ex!.measurements.map((m) => m.name);
    expect(names).toContain("HDL cholesterol");
    expect(names).toContain("LDL cholesterol");
    expect(names).toContain("HbA1c");
    expect(names).toContain("Fasting glucose");
    const hdl = ex!.measurements.find((m) => m.name === "HDL cholesterol");
    expect(hdl?.value).toBe(1.4);
    expect(hdl?.unit).toBe("mmol/L");
  });

  it("extracts wearable export patterns", () => {
    const ex = run("weekly summary — resting hr 54, sleep duration 7.2", "watch-export.csv");
    const names = ex?.measurements.map((m) => m.name) ?? [];
    expect(names).toContain("Resting heart rate");
    expect(names).toContain("Sleep duration");
  });

  it("assumes nothing when no patterns match", () => {
    const ex = run("beautiful sunset photo", "IMG_4032.jpg");
    expect(ex?.measurements).toHaveLength(0);
    expect(ex?.notes.join(" ")).toMatch(/nothing was extracted/i);
    expect(ex?.documentType).toBe("other");
  });

  it("extraction is not confirmation: result carries proposal notes", () => {
    const ex = run("HDL: 1.4", "h.txt");
    expect(ex?.notes.join(" ")).toMatch(/proposals only/i);
  });
});

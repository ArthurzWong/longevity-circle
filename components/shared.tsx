"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Educational-safety banner used across screens that touch health data. */
export function SafetyBanner({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "clay";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs leading-relaxed",
        tone === "clay"
          ? "border-clay-500/30 bg-clay-100/70 text-clay-600"
          : "border-sage-200 bg-sage-50/90 text-sage-800"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-4 w-4 shrink-0"
        aria-hidden
      >
        {tone === "clay" ? (
          <>
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M12 11v5" />
          </>
        )}
      </svg>
      <span>
        <span className={cn("mr-1.5 font-bold", tone === "clay" ? "text-clay-600" : "text-sage-700")}>
          {tone === "clay" ? "Important:" : "Note:"}
        </span>
        {children}
      </span>
    </div>
  );
}

export function DemoBadge({ label = "DEMO" }: { label?: string }) {
  return <Badge variant="demo">{label}</Badge>;
}

export function EvidenceStrengthBadge({ strength }: { strength: string }) {
  const tone =
    strength === "strong" ? "default" : strength === "moderate" ? "gold" : strength === "mixed" ? "warn" : "outline";
  return <Badge variant={tone as "default" | "gold" | "warn" | "outline"}>Evidence: {strength}</Badge>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-sage-600">{eyebrow}</p>
      ) : null}
      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-ink-faint">{subtitle}</p> : null}
    </header>
  );
}

/** Renders the AI structured answer with section styling. */
export function LabelledText({ text }: { text: string }) {
  return <div className="ai-prose text-sm text-ink-soft">{text}</div>;
}

/**
 * SVG progress ring — the signature data-viz element (stat rings are the
 * dominant wellness-app pattern on Mobbin/Dribbble). Educational only.
 */
export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  label,
  sublabel,
  tone = "sage",
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  tone?: "sage" | "gold" | "paper";
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const track =
    tone === "paper" ? "rgba(255,255,255,0.22)" : tone === "gold" ? "rgba(211,176,113,0.3)" : "rgba(49,82,65,0.14)";
  const fill =
    tone === "paper"
      ? "url(#ring-paper)"
      : tone === "gold"
        ? "url(#ring-gold)"
        : "url(#ring-sage)";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ring-sage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E9C81" />
            <stop offset="100%" stopColor="#315241" />
          </linearGradient>
          <linearGradient id="ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3C88F" />
            <stop offset="100%" stopColor="#C49A58" />
          </linearGradient>
          <linearGradient id="ring-paper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EBD6" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      {label ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("tnum font-display font-extrabold leading-none", tone === "paper" ? "text-paper" : "text-ink")} style={{ fontSize: size * 0.26 }}>
            {label}
          </span>
          {sublabel ? (
            <span className={cn("mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]", tone === "paper" ? "text-paper/70" : "text-ink-faint")}>
              {sublabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Small square icon tile with tinted background — replaces emoji as UI iconography. */
export function IconTile({
  children,
  tone = "sage",
  className,
}: {
  children: React.ReactNode;
  tone?: "sage" | "gold" | "clay" | "deep";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        tone === "sage" && "bg-sage-100 text-sage-700",
        tone === "gold" && "bg-gold-100 text-gold-700",
        tone === "clay" && "bg-clay-100 text-clay-600",
        tone === "deep" && "bg-white/12 text-paper",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Consistent inline icons (1.8 stroke family) for page-level usage. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-[18px] w-[18px]", className)}
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export type IconName =
  | "check" | "check-circle" | "moon" | "flask" | "target" | "sun"
  | "arrow-right" | "spark" | "book" | "leaf" | "heart" | "scale"
  | "upload" | "shield" | "chart" | "users" | "clock" | "refresh"
  | "download" | "trash" | "plus" | "search" | "send" | "play"
  | "headphones" | "file" | "message" | "flag" | "settings" | "x";

export const ICON_PATHS: Record<IconName, React.ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  flask: (
    <>
      <path d="M10 3h4M10 3v6l-5.2 8.7A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3.3L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7Z" />
      <path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.5 3.5-7" />
    </>
  ),
  heart: <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6Z" />,
  scale: (
    <>
      <path d="M12 3v18M8 21h8" />
      <path d="M3 8h18M3 8l3 6a4 4 0 0 1-6 0ZM21 8l-3 6a4 4 0 0 0 6 0Z" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 9 5-5 5 5M12 4v12" />
    </>
  ),
  shield: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />,
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-5 3 3 5-7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.7-3.2 2.9-5 5.5-5s4.8 1.8 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17.5 15.4c1.7.7 2.7 2.3 3 4.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 11 5 5 5-5M12 4v12" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  send: <path d="m22 2-7 20-4-9-9-4Zm0 0L11 13" />,
  play: <path d="M6 4.5v15l13-7.5Z" />,
  headphones: (
    <>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />,
  flag: (
    <>
      <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 8 2a6 6 0 0 0 3-.8V14a6 6 0 0 1-3 .8c-3 0-5-2-8-2a6 6 0 0 0-4 1.2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
};

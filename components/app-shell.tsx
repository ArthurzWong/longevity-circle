"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Floating glass tab bar per brief: HOME · EXPLORE · AI · EXPERIMENTS · CIRCLE · PROFILE
const TABS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/explore", label: "Explore", icon: CompassIcon },
  { href: "/ai", label: "AI", icon: SparkIcon },
  { href: "/experiments", label: "Labs", icon: FlaskIcon },
  { href: "/circle", label: "Circle", icon: UsersIcon },
  { href: "/profile", label: "You", icon: UserIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="atmosphere relative mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col">
      {/* Top brand bar */}
      <header className="sticky top-0 z-40 px-5 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-700 text-paper shadow-glow">
              <MarkIcon className="h-4 w-4" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-ink">
              Longevity<span className="text-sage-600"> Circle</span>
            </span>
          </Link>
          <span className="rounded-full border border-gold-400/50 bg-gold-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-700">
            Demo
          </span>
        </div>
      </header>

      <div className="flex-1 pb-32">{children}</div>

      {/* Floating glass nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 nav-safe">
        <div className="mx-auto w-fit max-w-[calc(100%-2rem)]">
          <div className="glass-nav flex items-center gap-0.5 rounded-full border border-white/70 p-1.5 shadow-nav">
            {TABS.map((t) => {
              const active = pathname === t.href || pathname?.startsWith(t.href + "/");
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-label={t.label}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 transition-all duration-300 sm:px-3.5",
                    active
                      ? "bg-sage-700 text-paper shadow-glow"
                      : "text-ink-faint hover:bg-sage-100/70 hover:text-ink-soft"
                  )}
                >
                  <t.icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.1 : 1.7} />
                  <span className={cn("text-[9px] font-semibold tracking-wide", active ? "opacity-100" : "opacity-80")}>
                    {t.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

// Inline icons — consistent 1.7-2.1 stroke family, currentColor
function svg(props: React.SVGProps<SVGSVGElement>) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  );
}
function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
function FlaskIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <path d="M10 3h4M10 3v6l-5.2 8.7A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3.3L14 9V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.7-3.2 2.9-5 5.5-5s4.8 1.8 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17.5 15.4c1.7.7 2.7 2.3 3 4.6" />
    </svg>
  );
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20.5c1-3.8 3.7-6 7-6s6 2.2 7 6" />
    </svg>
  );
}
function MarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svg(props)}>
      <path d="M12 20c-4-1.5-7-5-7-9.5C5 7 7.5 4.5 10.5 4c1.5-.2 3 .3 4 1.5" />
      <path d="M12 20c4-1.5 7-5 7-9.5 0-1.5-.4-2.9-1.2-4" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

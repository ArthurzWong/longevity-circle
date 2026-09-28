import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-sage-200/90 bg-white/85 px-3.5 text-[15px] text-ink placeholder:text-ink-faint/50 shadow-[inset_0_1px_2px_rgba(27,42,34,0.04)] transition-all focus:border-sage-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sage-500/15",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[90px] w-full rounded-xl border border-sage-200/90 bg-white/85 p-3.5 text-[15px] text-ink placeholder:text-ink-faint/50 shadow-[inset_0_1px_2px_rgba(27,42,34,0.04)] transition-all focus:border-sage-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sage-500/15",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-ink-soft", className)} {...props} />;
}

/** Mobile-first segmented selector used across onboarding and forms. */
export function OptionGrid({
  options,
  value,
  onChange,
  multi = false,
  columns = 2,
}: {
  options: { value: string; label: string; hint?: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const toggle = (v: string) => {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange([v]);
    }
  };
  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[columns];
  return (
    <div className={cn("grid gap-2", cols)}>
      {options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            aria-pressed={active}
            className={cn(
              "rounded-xl border p-3 text-left text-sm transition-all duration-200 active:scale-[0.98]",
              active
                ? "border-sage-600 bg-sage-50 text-sage-800 shadow-[0_0_0_3px_rgba(78,125,99,0.12)]"
                : "border-sage-200/90 bg-white/60 text-ink-soft hover:border-sage-300 hover:bg-white"
            )}
          >
            <span className="font-semibold">{o.label}</span>
            {o.hint ? <span className="mt-0.5 block text-xs text-ink-faint">{o.hint}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

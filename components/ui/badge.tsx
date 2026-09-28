import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "border-sage-200 bg-sage-50 text-sage-700",
        gold: "border-gold-300/60 bg-gold-50 text-gold-700",
        outline: "border-sage-300 text-ink-soft",
        warn: "border-clay-500/40 bg-clay-100 text-clay-600",
        muted: "border-transparent bg-mist/70 text-ink-faint",
        deep: "border-white/20 bg-white/10 text-paper backdrop-blur-sm",
        demo: "border-dashed border-gold-400/70 bg-gold-50 text-gold-700 uppercase",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

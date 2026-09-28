import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-45 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-sage-700 text-paper shadow-glow hover:bg-sage-800",
        gold:
          "surface-gold text-ink shadow-[0_6px_20px_-8px_rgba(168,127,66,0.6)] hover:brightness-105",
        outline:
          "border border-sage-300/80 bg-white/50 text-sage-800 backdrop-blur-sm hover:bg-sage-50 hover:border-sage-400",
        ghost: "text-ink-soft hover:bg-sage-100/70",
        danger: "bg-clay-600 text-white shadow-sm hover:bg-clay-500",
        light: "bg-white/90 text-sage-800 shadow-sm hover:bg-white",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

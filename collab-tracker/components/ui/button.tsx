"use client";

import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={ref as never}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          size === "sm" && "px-3 py-1.5",
          size === "md" && "px-4 py-2",
          size === "lg" && "px-6 py-3 text-base",
          variant === "primary" && "bg-primary text-primary-foreground hover:bg-indigo-500",
          variant === "secondary" && "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
          variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-slate-900",
          variant === "outline" && "border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

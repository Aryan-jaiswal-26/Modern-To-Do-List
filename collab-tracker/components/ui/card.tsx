import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-slate-900/20 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-950/30 dark:hover:shadow-slate-950/60",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-px rounded-[18px] border border-slate-100 dark:border-white/5" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

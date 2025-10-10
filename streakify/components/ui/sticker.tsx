"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type StickerProps = {
  icon?: ReactNode;
  label: string;
  accent?: string;
  className?: string;
};

export function Sticker({ icon, label, accent = "#60a5fa", className }: StickerProps) {
  return (
    <motion.div
      className={`relative inline-flex items-center gap-3 rounded-3xl px-5 py-3 shadow-lg shadow-slate-900/40 ${className ?? ""}`}
      initial={{ rotateX: -14, rotateY: 12, opacity: 0, y: 20 }}
      animate={{ rotateX: 0, rotateY: 0, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(30,41,59,0.9))",
        border: "1px solid rgba(148, 163, 184, 0.18)"
      }}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.2) 100%)`,
          boxShadow: `0 10px 30px -12px ${accent}`
        }}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      <motion.span
        className="absolute inset-0 rounded-3xl"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

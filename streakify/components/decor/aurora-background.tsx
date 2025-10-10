"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AuroraBackgroundProps = {
  className?: string;
  children?: ReactNode;
};

const blobs = [
  {
    background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0) 70%)",
    size: 480,
    duration: 18,
    delay: 0
  },
  {
    background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0) 70%)",
    size: 360,
    duration: 22,
    delay: 4
  },
  {
    background: "radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(34,211,238,0) 70%)",
    size: 520,
    duration: 20,
    delay: 2
  }
];

export function AuroraBackground({ className, children }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute -inset-40"
          style={{
            background: blob.background,
            width: blob.size,
            height: blob.size,
            filter: "blur(100px)"
          }}
          initial={{
            x: index * 120 - 160,
            y: index * 80 - 120,
            opacity: 0.6
          }}
          animate={{
            x: [blob.size * -0.3, blob.size * 0.25, blob.size * -0.35],
            y: [blob.size * -0.2, blob.size * 0.25, blob.size * -0.3],
            opacity: [0.5, 0.8, 0.6]
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: blob.delay
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

type ParticleFieldProps = {
  quantity?: number;
  className?: string;
};

export function ParticleField({ quantity = 24, className }: ParticleFieldProps) {
  const particles = Array.from({ length: quantity }).map((_, index) => ({
    id: index,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 10
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-slate-200/40 dark:bg-slate-200/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0.4],
            y: [-12, 12, -16]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

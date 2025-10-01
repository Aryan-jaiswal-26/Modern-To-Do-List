"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function InteractiveHero() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-300/30 dark:text-slate-600/30"
            />
          </pattern>
          
          {/* Gradients */}
          <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          <linearGradient id="taskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          
          <linearGradient id="workspaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <rect width="800" height="400" fill="url(#grid)" />

        {/* Goals Section */}
        <motion.g
          onHoverStart={() => setHoveredElement("goals")}
          onHoverEnd={() => setHoveredElement(null)}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <circle
            cx="200"
            cy="150"
            r={hoveredElement === "goals" ? "45" : "40"}
            fill="url(#goalGradient)"
            className="drop-shadow-lg"
          />
          <text
            x="200"
            y="155"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            Goals
          </text>
          
          {/* Goal Progress Rings */}
          <motion.circle
            cx="200"
            cy="150"
            r="55"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="20 5"
            animate={{ rotate: hoveredElement === "goals" ? 360 : 0 }}
            transition={{ duration: 2, repeat: hoveredElement === "goals" ? Infinity : 0, ease: "linear" }}
          />
        </motion.g>

        {/* Tasks Section */}
        <motion.g
          onHoverStart={() => setHoveredElement("tasks")}
          onHoverEnd={() => setHoveredElement(null)}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <rect
            x="360"
            y="110"
            width={hoveredElement === "tasks" ? "90" : "80"}
            height={hoveredElement === "tasks" ? "90" : "80"}
            rx="15"
            fill="url(#taskGradient)"
            className="drop-shadow-lg"
          />
          <text
            x="400"
            y="160"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            Tasks
          </text>
          
          {/* Task Checkmarks */}
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M ${375 + i * 15} ${135 + i * 10} L ${380 + i * 15} ${140 + i * 10} L ${390 + i * 15} ${130 + i * 10}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: hoveredElement === "tasks" ? 1 : 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </motion.g>

        {/* Workspaces Section */}
        <motion.g
          onHoverStart={() => setHoveredElement("workspaces")}
          onHoverEnd={() => setHoveredElement(null)}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <polygon
            points={hoveredElement === "workspaces" ? "600,110 650,130 650,180 600,200 550,180 550,130" : "600,115 645,130 645,175 600,190 555,175 555,130"}
            fill="url(#workspaceGradient)"
            className="drop-shadow-lg"
          />
          <text
            x="600"
            y="160"
            textAnchor="middle"
            className="fill-white text-sm font-semibold"
          >
            Teams
          </text>
          
          {/* Team Members */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={585 + i * 15}
              cy={145 + (i % 2) * 10}
              r="4"
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: hoveredElement === "workspaces" ? 1 : 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />
          ))}
        </motion.g>

        {/* Connecting Lines */}
        <motion.path
          d="M 240 150 Q 300 120 360 150"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          opacity={hoveredElement ? 0.8 : 0.3}
        />
        
        <motion.path
          d="M 440 150 Q 500 120 560 150"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          opacity={hoveredElement ? 0.8 : 0.3}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={100 + i * 80}
            cy={50 + (i % 3) * 100}
            r="2"
            fill="currentColor"
            className="text-blue-400/40"
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Hover Info */}
      <AnimatePresence>
        {hoveredElement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-slate-800 shadow-lg backdrop-blur-sm dark:bg-slate-800/90 dark:text-slate-200"
          >
            {hoveredElement === "goals" && "Track habits and build streaks"}
            {hoveredElement === "tasks" && "Organize and complete your to-dos"}
            {hoveredElement === "workspaces" && "Collaborate with your team"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
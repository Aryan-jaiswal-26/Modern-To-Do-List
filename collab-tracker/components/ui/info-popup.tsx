"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Lightbulb, Target, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoPopup({ isOpen, onClose }: InfoPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Info className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-100">About StreakForge</h2>
                  <p className="text-sm text-slate-400">Your collaborative habit tracking companion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  icon={<Target className="h-5 w-5 text-rose-400" />}
                  title="Personal Goals"
                  description="Create daily, weekday, or custom schedule goals to build lasting habits"
                />
                <FeatureCard
                  icon={<Users className="h-5 w-5 text-blue-400" />}
                  title="Team Workspaces"
                  description="Collaborate with friends and colleagues on shared goals and challenges"
                />
                <FeatureCard
                  icon={<Calendar className="h-5 w-5 text-green-400" />}
                  title="Flexible Scheduling"
                  description="Set goals for daily practice, weekdays only, or custom day patterns"
                />
                <FeatureCard
                  icon={<Lightbulb className="h-5 w-5 text-yellow-400" />}
                  title="Smart Analytics"
                  description="Track streaks, view progress charts, and celebrate milestones"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Getting Started</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold">1</span>
                    <span>Create your account and set up your profile</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">2</span>
                    <span>Add personal goals or create/join team workspaces</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">3</span>
                    <span>Start tracking your progress and building streaks</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h4 className="font-semibold text-slate-100 mb-1">{title}</h4>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 hover:scale-105"
        title="App Information"
      >
        <Info className="h-5 w-5" />
      </button>
      <InfoPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
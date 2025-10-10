"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import axios from "axios";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateGoalModal({ isOpen, onClose, onSuccess }: CreateGoalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      scheduleType: formData.get("scheduleType") as string,
    };

    try {
      await axios.post("/api/goals", data);
      addToast({
        type: "success",
        title: "Goal created!",
        description: "Your new goal has been added successfully."
      });
      onSuccess();
      onClose();
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to create goal",
        description: "Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Create Goal</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Title</label>
                <input
                  name="title"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="Daily exercise"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  name="description"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="30 minutes of exercise"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Schedule</label>
                <select
                  name="scheduleType"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  {isLoading ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
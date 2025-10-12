"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import axios from "axios";

interface JoinWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinWorkspaceModal({ isOpen, onClose, onSuccess }: JoinWorkspaceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    try {
      const response = await axios.post("/api/invite-codes/join", { code });
      
      addToast({
        type: "success",
        title: "Joined workspace!",
        description: "You've successfully joined the workspace."
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to join workspace";
      
      addToast({
        type: "error",
        title: "Failed to join workspace",
        description: typeof errorMessage === 'string' ? errorMessage : "Invalid or expired invite code. Please check and try again."
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Join Workspace</h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter the invite code shared by your team to join their workspace and start collaborating on goals together.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
                  Invite Code
                </label>
                <input
                  name="code"
                  required
                  minLength={6}
                  maxLength={20}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono tracking-wider uppercase transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="ABCD1234"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Ask your team admin for the invite code
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:brightness-110"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Workspace
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  You'll get access to shared goals and team activity
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Your personal workspace data stays private
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

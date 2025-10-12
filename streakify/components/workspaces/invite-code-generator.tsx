"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import axios from "axios";

interface InviteCodeGeneratorProps {
  workspaceId: string | number;
  workspaceName: string;
  userRole: string;
}

export function InviteCodeGenerator({ workspaceId, workspaceName, userRole }: InviteCodeGeneratorProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  // Only workspace owners can generate invite codes
  if (userRole !== "owner") {
    return null;
  }

  async function generateInviteCode() {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/invite-codes", {
        workspaceId,
        expiresAt: null // No expiration (you can add UI to set custom expiration)
      });
      
      setInviteCode(response.data.code);
      
      addToast({
        type: "success",
        title: "Invite code generated!",
        description: "Share this code with your team members."
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to generate invite code";
      
      addToast({
        type: "error",
        title: "Generation failed",
        description: typeof errorMessage === 'string' ? errorMessage : "Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!inviteCode) return;
    
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      
      addToast({
        type: "success",
        title: "Copied!",
        description: "Invite code copied to clipboard."
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        type: "error",
        title: "Copy failed",
        description: "Please copy the code manually."
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Invite Members
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Generate a code to invite team members to <span className="font-medium">{workspaceName}</span>
          </p>
        </div>
        <Button
          onClick={generateInviteCode}
          disabled={isLoading}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:brightness-110"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-2" />
              Generate Code
            </>
          )}
        </Button>
      </div>

      {inviteCode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Invite Code
                </span>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Clock className="h-3 w-3" />
                  No expiration
                </div>
              </div>
              <div className="flex items-center gap-3">
                <code className="flex-1 rounded-lg bg-white px-4 py-3 text-lg font-bold tracking-wider text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  {inviteCode}
                </code>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 Share this code with team members so they can join your workspace. 
              They can enter it by clicking "Join Workspace" on the workspaces page.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

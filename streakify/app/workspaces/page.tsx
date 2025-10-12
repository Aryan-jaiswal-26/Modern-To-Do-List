"use client";

import { useState, Suspense } from "react";
import { Navbar } from "@/components/ui/navbar";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import { WorkspaceFeed } from "@/components/workspaces/workspace-feed";
import { CreateWorkspaceModal } from "@/components/workspaces/create-workspace-modal";
import { JoinWorkspaceModal } from "@/components/workspaces/join-workspace-modal";
import { InviteCodeGenerator } from "@/components/workspaces/invite-code-generator";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";
import { Card } from "@/components/ui/card";
import { Sticker } from "@/components/ui/sticker";
import { Users, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

type Workspace = {
  id: number;
  name: string;
  role: string;
};

export default function WorkspacesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { mutate, data: workspaces } = useSWR<Workspace[]>("/api/workspaces", fetcher);
  const workspaceId = useUIStore((state) => state.workspaceId);
  
  const currentWorkspace = workspaces?.find(w => String(w.id) === workspaceId);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="relative overflow-hidden">
        <AuroraBackground className="absolute inset-0 opacity-90">
          <ParticleField quantity={36} />
        </AuroraBackground>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-20 pt-12 lg:px-10">
          <header className="glass relative rounded-3xl border border-white/10 px-8 py-8 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <Sticker icon={<Users className="h-5 w-5 text-white" />} label="Team collaboration" accent="#8b5cf6" />
                <div>
                  <h1 className="text-3xl font-semibold leading-tight text-slate-50">Your Workspaces</h1>
                  <p className="mt-2 max-w-xl text-sm text-slate-300">
                    Collaborate with your team, share goals, and build habits together in shared workspaces.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => setIsJoinModalOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Workspace
                </Button>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white font-semibold px-6 py-3 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workspace
                </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Workspaces</h2>
                  <WorkspaceSwitcher />
                </div>
              </Card>
              
              {currentWorkspace && (
                <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
                  <InviteCodeGenerator 
                    workspaceId={currentWorkspace.id}
                    workspaceName={currentWorkspace.name}
                    userRole={currentWorkspace.role}
                  />
                </Card>
              )}
            </div>

            <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Activity Feed</h2>
                <Suspense fallback={<div className="text-sm text-slate-400">Loading activity...</div>}>
                  <WorkspaceFeed />
                </Suspense>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <CreateWorkspaceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => mutate()}
      />
      
      <JoinWorkspaceModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
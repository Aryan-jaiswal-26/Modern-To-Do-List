"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import { WorkspaceFeed } from "@/components/workspaces/workspace-feed";
import { WorkspaceOverview } from "@/components/workspaces/workspace-overview";
import { TaskList } from "@/components/tasks/task-list";
import { GoalBoard } from "@/components/goals/goal-board";
import { InteractiveHero } from "@/components/ui/interactive-hero";
import { Suspense } from "react";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";
import { Card } from "@/components/ui/card";
import { Sticker } from "@/components/ui/sticker";
import { Flame, TrendingUp, Users, Target } from "lucide-react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { data: stats } = useSWR("/api/dashboard/stats", fetcher);

  if (status === "loading") {
    return <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="text-slate-600 dark:text-slate-400">Loading...</div>
    </div>;
  }

  if (!session?.user) {
    redirect("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="relative overflow-hidden">
        <AuroraBackground className="absolute inset-0 opacity-90">
          <ParticleField quantity={48} />
        </AuroraBackground>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 pt-12 lg:px-10">
        <header className="glass relative rounded-3xl border border-white/10 px-8 py-10 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Sticker icon={<Flame className="h-5 w-5 text-white" />} label="Active streaks are glowing" accent="#f97316" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Welcome back, trailblazer</p>
                <h1 className="mt-2 text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {session.user.name ?? session.user.email}
                </h1>
              </div>
              <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
                Monitor workspace momentum, celebrate wins, and keep your habit engines running hot. Everything you need for personal and collaborative streak success lives here.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-5 py-3 text-xs uppercase tracking-wide text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  Live streak sync active
                </div>
              </div>
            </div>
          </div>
        </header>

        <InteractiveHero />

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Goals</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.activeGoals || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.totalTasks || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Workspaces</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.workspaces || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your workspaces</h2>
            <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Tap to focus</span>
          </div>
          <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-6">
            <WorkspaceSwitcher />
          </Card>
        </section>

        <Suspense fallback={<div className="text-sm text-slate-400">Loading workspace overview...</div>}>
          <WorkspaceOverview />
        </Suspense>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="space-y-6 border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Goals</h2>
              <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Celebrations queued</span>
            </div>
            <GoalBoard />
          </Card>
          <Card className="space-y-6 border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal tasks</h2>
              <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Stay agile</span>
            </div>
            <TaskList />
          </Card>
        </section>

        <Suspense fallback={<div className="text-sm text-slate-400">Fetching feed...</div>}>
          <WorkspaceFeed />
        </Suspense>
        </div>
      </main>
    </div>
  );
}

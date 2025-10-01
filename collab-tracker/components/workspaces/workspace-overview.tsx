"use client";

import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Target, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUIStore } from "@/lib/store";

type WorkspaceSummary = {
  members: number;
  activeGoals: number;
  streakLeaders: { user: string; streak: number }[];
};

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return {
      members: 1,
      activeGoals: 0,
      streakLeaders: []
    } as WorkspaceSummary;
  } catch (error) {
    return {
      members: 0,
      activeGoals: 0,
      streakLeaders: []
    } as WorkspaceSummary;
  }
};

export function WorkspaceOverview() {
  const workspaceId = useUIStore((state) => state.workspaceId);
  const { data } = useSWR<WorkspaceSummary>(
    workspaceId ? `/api/workspaces/${workspaceId}` : null,
    fetcher
  );

  if (!workspaceId) {
    return null;
  }

  const stats = [
    {
      title: "Members",
      value: data?.members ?? 0,
      icon: <Users className="h-6 w-6 text-sky-300" />,
      gradient: "from-sky-500/40 via-sky-400/20 to-transparent"
    },
    {
      title: "Active goals",
      value: data?.activeGoals ?? 0,
      icon: <Target className="h-6 w-6 text-emerald-300" />,
      gradient: "from-emerald-500/30 via-emerald-400/15 to-transparent"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden border-white/10 bg-white/5 p-6">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
          <div className="relative z-10 space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white shadow-inner shadow-black/30">
              {stat.icon}
            </div>
            <p className="text-sm uppercase tracking-wide text-slate-400">{stat.title}</p>
            <p className="text-3xl font-semibold text-slate-100">{stat.value}</p>
          </div>
        </Card>
      ))}

      <Card className="relative overflow-hidden border-white/10 bg-white/5 p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/30 via-purple-500/15 to-transparent" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Streak leaders</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">Top momentum</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-rose-200 shadow-inner shadow-black/30">
            <Flame className="h-6 w-6" />
          </div>
        </div>
        <ul className="relative z-10 mt-6 space-y-3 text-sm text-slate-200">
          {data?.streakLeaders?.length ? (
            data.streakLeaders.map((leader, index) => (
              <motion.li
                key={leader.user}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="font-medium text-slate-100">{leader.user}</span>
                <span className="text-sm text-rose-200">{leader.streak} days</span>
              </motion.li>
            ))
          ) : (
            <li className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-slate-400">
              No streaks yet. Complete a goal to take the lead!
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

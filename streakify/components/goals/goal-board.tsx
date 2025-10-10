"use client";

import axios from "axios";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/components/providers/confetti-provider";

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  scheduleType: string;
  scheduleDays: number[];
  workspaceId?: string | null;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data as Goal[]);

function scheduleLabel(goal: Goal) {
  if (goal.scheduleType === "daily") return "Daily";
  if (goal.scheduleType === "weekdays") return "Weekdays";
  if (goal.scheduleType === "custom") {
    const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return goal.scheduleDays.map((day) => map[day]).join(", ");
  }
  return goal.scheduleType;
}

export function GoalBoard() {
  const workspaceId = useUIStore((state) => state.workspaceId);
  const { burst } = useConfetti();
  const { data, mutate } = useSWR<Goal[]>(
    workspaceId ? `/api/workspaces/${workspaceId}/goals` : "/api/goals",
    fetcher
  );

  async function complete(goal: Goal) {
    await axios.post(`/api/goals/${goal.id}/complete`);
    await mutate();
    burst();
  }

  if (!data?.length) {
    return <Card className="text-sm text-slate-300">No goals tracked yet.</Card>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {data.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card className="relative space-y-5 overflow-hidden border-white/10 bg-white/5 p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-sky-500/10" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">{goal.title}</h3>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {goal.workspaceId ? "Workspace" : "Personal"}
                </span>
              </div>
              {goal.description && <p className="text-sm text-slate-300/80">{goal.description}</p>}
            </div>
            <div className="relative z-10 flex items-center justify-between text-sm text-slate-200">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
                {scheduleLabel(goal)} schedule
              </div>
              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/30 hover:brightness-110"
                onClick={() => complete(goal)}
              >
                Complete today
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

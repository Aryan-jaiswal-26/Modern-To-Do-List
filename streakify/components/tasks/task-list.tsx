"use client";

import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  completed: boolean;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data as Task[]);

export function TaskList() {
  const { data, mutate } = useSWR<Task[]>("/api/tasks", fetcher);

  async function toggle(task: Task) {
    await axios.patch(`/api/tasks/${task.id}`, { completed: !task.completed });
    await mutate();
  }

  if (!data?.length) {
    return (
      <Card className="text-sm text-slate-300">
        No tasks yet. Add your first one.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((task, index) => {
        const dueLabel = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : undefined;
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            <Card className="flex items-start justify-between gap-6 border-white/10 bg-white/5 p-5">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-100">
                  {task.completed ? <span className="line-through opacity-50">{task.title}</span> : task.title}
                </h3>
                {task.notes && <p className="text-sm text-slate-300/80">{task.notes}</p>}
                <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
                  <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
                  {task.completed ? "Completed" : "In progress"}
                  {dueLabel && <span className="text-slate-500">• Due {dueLabel}</span>}
                </div>
              </div>
              <Button
                variant={task.completed ? "secondary" : "primary"}
                className={`rounded-xl px-4 py-2 text-sm ${task.completed ? "bg-white/10 text-slate-100 hover:bg-white/20" : "bg-gradient-to-r from-emerald-400 to-sky-500 text-slate-950"}`}
                onClick={() => toggle(task)}
              >
                {task.completed ? "Mark pending" : "Complete"}
              </Button>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

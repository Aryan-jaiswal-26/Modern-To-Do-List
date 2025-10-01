"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";
import { Card } from "@/components/ui/card";
import { Sticker } from "@/components/ui/sticker";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function TasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutate } = useSWR("/api/tasks", fetcher);

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
                <Sticker icon={<CheckSquare className="h-5 w-5 text-white" />} label="Task management" accent="#3b82f6" />
                <div>
                  <h1 className="text-3xl font-semibold leading-tight text-slate-50">Your Tasks</h1>
                  <p className="mt-2 max-w-xl text-sm text-slate-300">
                    Organize your to-dos, set priorities, and stay productive with smart task management.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:brightness-110 text-white font-semibold px-6 py-3 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </header>

          <Card className="border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 p-8">
            <TaskList />
          </Card>
        </div>
      </main>
      
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
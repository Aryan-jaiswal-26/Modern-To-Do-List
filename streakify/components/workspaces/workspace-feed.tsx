"use client";

import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useUIStore } from "@/lib/store";

type Activity = {
  id: string;
  message: string;
  createdAt: string;
};

const fetcher = async (url: string) => {
  const { data } = await axios.get(url);
  return (data as any[]).map((item) => ({
    id: item.id,
    message: item.message,
    createdAt: item.created_at ?? item.createdAt
  })) as Activity[];
};

export function WorkspaceFeed() {
  const id = useUIStore((state) => state.workspaceId);
  const { data } = useSWR<Activity[]>(
    id ? `/api/workspaces/${id}/feed` : null,
    fetcher,
    { refreshInterval: 10_000 }
  );

  if (!id) {
    return <Card className="text-sm text-slate-300">Select a workspace to view activity.</Card>;
  }

  return (
    <Card className="space-y-6 border-white/10 bg-white/5 p-7">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Workspace feed</h3>
        <span className="text-xs uppercase tracking-wide text-slate-400">Auto-refreshing</span>
      </div>
      <div className="space-y-3">
        {data?.length ? (
          data.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <p className="font-medium text-slate-100">{item.message}</p>
              <span className="mt-2 block text-xs uppercase tracking-wide text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No activity yet. Keep the streaks going!</p>
        )}
      </div>
    </Card>
  );
}

"use client";

import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/lib/store";

type Workspace = {
  id: string;
  name: string;
  role: string;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data as Workspace[]);

export function WorkspaceSwitcher() {
  const { data } = useSWR<Workspace[]>("/api/workspaces", fetcher);
  const workspaceId = useUIStore((state) => state.workspaceId);
  const setWorkspaceId = useUIStore((state) => state.setWorkspaceId);

  useEffect(() => {
    if (!workspaceId && data?.length) {
      setWorkspaceId(data[0].id);
    }
  }, [workspaceId, data, setWorkspaceId]);

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-5 text-sm text-slate-300">
        No workspaces yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((workspace) => {
        const active = workspaceId === workspace.id;
        return (
          <motion.button
            key={workspace.id}
            onClick={() => setWorkspaceId(workspace.id)}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              active ? "text-slate-900" : "text-slate-200"
            }`}
            style={
              active
                ? {
                    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                    boxShadow: "0 10px 30px -12px rgba(129,140,248,0.7)"
                  }
                : {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)"
                  }
            }
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: active ? 1.02 : 1.04, backgroundColor: active ? undefined : "rgba(255,255,255,0.12)" }}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
            {workspace.name}
            <span className="text-xs text-slate-300/80">{workspace.role}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

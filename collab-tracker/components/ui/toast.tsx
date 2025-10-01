"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-rose-500",
    info: "from-blue-500 to-cyan-500",
    warning: "from-yellow-500 to-orange-500",
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className="relative max-w-sm overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-sm"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colors[toast.type]} opacity-10`} />
      <div className="relative flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 text-${toast.type === 'success' ? 'green' : toast.type === 'error' ? 'red' : toast.type === 'warning' ? 'yellow' : 'blue'}-400`} />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-slate-100">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-slate-300">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-slate-400 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
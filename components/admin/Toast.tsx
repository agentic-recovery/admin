"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";
interface Toast { id: string; message: string; type: ToastType; }
interface ToastCtx { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle };
const COLORS = {
  success: { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  color: "#10B981" },
  error:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   color: "#EF4444" },
  warning: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  color: "#F59E0B" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            const c    = COLORS[t.type];
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{    opacity: 0, x: 100,scale: 0.9 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto min-w-[260px] max-w-sm"
                style={{ background: "var(--bg-card)", border: `1px solid ${c.border}` }}>
                <Icon size={15} style={{ color: c.color, flexShrink: 0 }} />
                <p className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{t.message}</p>
                <button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
                  style={{ color: "var(--text-muted)" }} className="flex-shrink-0">
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

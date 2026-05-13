"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open:        boolean;
  title:       string;
  message:     string;
  confirmLabel?: string;
  danger?:     boolean;
  loading?:    boolean;
  onConfirm:   () => void;
  onCancel:    () => void;
}

export default function ConfirmModal({
  open, title, message, confirmLabel = "Confirm", danger = false, loading = false, onConfirm, onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={onCancel}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: danger ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)" }}>
                  <AlertTriangle size={18} style={{ color: danger ? "#EF4444" : "#F59E0B" }} />
                </div>
                <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
              </div>
              <button onClick={onCancel} style={{ color: "var(--text-muted)" }}><X size={16} /></button>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center gap-2"
                style={{ background: danger ? "#EF4444" : "#F59E0B" }}>
                {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

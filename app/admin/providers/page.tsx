"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, RefreshCw, Check, X, ShieldOff, ShieldCheck, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ToastProvider, useToast } from "@/components/admin/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Status = "all" | "pending" | "approved" | "blocked";

function StatusBadge({ p }: { p: any }) {
  if (p.isBlocked)   return <span className="badge badge-danger">Blocked</span>;
  if (p.isApproved)  return <span className="badge badge-success">Approved</span>;
  return <span className="badge badge-warning">Pending</span>;
}

function ProviderRow({ p, onAction }: { p: any; onAction: (action: string, id: string, name: string) => void }) {
  const router = useRouter();
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="border-b transition-colors"
      style={{ borderColor: "var(--border-subtle)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {p.logoUrl
            ? <img src={p.logoUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
            : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(91,91,214,0.15)", color: "#A5A5E8" }}>
                {p.companyName?.[0] ?? "?"}
              </div>}
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.companyName}</p>
            <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{p.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {p.city ?? p.serviceArea?.city ?? "—"}
          {p.postcode ? ` · ${p.postcode}` : ""}
        </p>
      </td>
      <td className="px-4 py-3.5"><StatusBadge p={p} /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {p.stats?.completedJobs ?? 0} jobs
        </p>
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
          {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }) : "—"}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button onClick={() => router.push(`/admin/providers/${p._id}`)}
            title="View details"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(91,91,214,0.1)", color: "#A5A5E8" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,91,214,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(91,91,214,0.1)")}>
            <Eye size={12} />
          </button>
          {!p.isApproved && !p.isBlocked && (
            <button onClick={() => onAction("approve", p._id, p.companyName)}
              title="Approve" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}>
              <Check size={12} />
            </button>
          )}
          {!p.isApproved && !p.isBlocked && (
            <button onClick={() => onAction("reject", p._id, p.companyName)}
              title="Reject" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}>
              <X size={12} />
            </button>
          )}
          {p.isBlocked
            ? <button onClick={() => onAction("unblock", p._id, p.companyName)} title="Unblock"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}>
                <ShieldCheck size={12} />
              </button>
            : <button onClick={() => onAction("block", p._id, p.companyName)} title="Block"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}>
                <ShieldOff size={12} />
              </button>
          }
          <button onClick={() => onAction("delete", p._id, p.companyName)} title="Delete"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}>
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function ProvidersContent() {
  const { toast }      = useToast();
  const [providers,  setProviders]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState<Status>("all");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState<{ action: string; id: string; name: string } | null>(null);
  const [acting, setActing] = useState(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) qs.set("search", search);
    if (status !== "all") qs.set("status", status);
    const r = await fetch(`${API}/api/admin/providers?${qs}`, { credentials: "include" });
    const d = await r.json();
    setProviders(Array.isArray(d.data) ? d.data : []);
    setTotalPages(d.meta?.totalPages ?? 1);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const confirmMessages: Record<string, string> = {
    approve:  "Approve this provider? They will receive an email notification.",
    reject:   "Reject this provider? Their account will be deactivated.",
    block:    "Block this provider? They will lose access immediately.",
    unblock:  "Unblock this provider and restore their access?",
    delete:   "Permanently delete this provider? This cannot be undone.",
  };

  const handleAction = async () => {
    if (!modal) return;
    setActing(true);
    try {
      const { action, id } = modal;
      const res = await fetch(`${API}/api/admin/providers/${id}/${action === "delete" ? "" : action}`, {
        method:      action === "delete" ? "DELETE" : "PATCH",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        action === "delete" ? undefined : "{}",
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast(`Provider ${action}d successfully`, "success");
      fetchProviders();
    } catch (err: any) {
      toast(err.message || "Action failed", "error");
    } finally {
      setActing(false);
      setModal(null);
    }
  };

  return (
    <AdminLayout title="Providers">
      <div className="max-w-6xl space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search name or email…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field" style={{ paddingLeft: "2.5rem" }} />
          </div>
          <div className="flex gap-2">
            {(["all","pending","approved","blocked"] as Status[]).map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className="px-3 py-2 rounded-lg text-xs font-mono capitalize transition-all"
                style={{
                  background: status === s ? "rgba(239,68,68,0.15)" : "var(--bg-input)",
                  border: status === s ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border-default)",
                  color: status === s ? "#F87171" : "var(--text-muted)",
                }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={fetchProviders} className="p-2 rounded-lg transition-all"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-muted)" }}>
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Provider","Location","Status","Jobs","Joined","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="shimmer h-10 rounded-lg" /></td></tr>
                  ))
                : providers.length === 0
                ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}>No providers found.</td></tr>
                : providers.map((p) => (
                    <ProviderRow key={p._id} p={p}
                      onAction={(action, id, name) => setModal({ action, id, name })} />
                  ))
              }
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t"
              style={{ borderColor: "var(--border-subtle)" }}>
              <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 transition-all"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                  Previous
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 transition-all"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!modal}
        title={modal ? `${modal.action.charAt(0).toUpperCase() + modal.action.slice(1)} Provider` : ""}
        message={modal ? (confirmMessages[modal.action] ?? `Are you sure you want to ${modal.action} "${modal.name}"?`) : ""}
        confirmLabel={modal?.action.charAt(0).toUpperCase() + (modal?.action.slice(1) ?? "")}
        danger={["delete","block","reject"].includes(modal?.action ?? "")}
        loading={acting}
        onConfirm={handleAction}
        onCancel={() => setModal(null)}
      />
    </AdminLayout>
  );
}

export default function ProvidersPage() {
  return <ToastProvider><ProvidersContent /></ToastProvider>;
}

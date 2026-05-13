"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, ShieldOff, ShieldCheck, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ToastProvider, useToast } from "@/components/admin/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
type Status = "all" | "active" | "blocked";

function CustomersContent() {
  const { toast }   = useToast();
  const router      = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState<Status>("all");
  const [page,      setPage]      = useState(1);
  const [totalPages,setTotalPages]= useState(1);
  const [modal, setModal] = useState<{ action: string; id: string; name: string } | null>(null);
  const [acting, setActing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) qs.set("search", search);
    if (status !== "all") qs.set("status", status);
    const r = await fetch(`${API}/api/admin/customers?${qs}`, { credentials: "include" });
    const d = await r.json();
    setCustomers(Array.isArray(d.data) ? d.data : []);
    setTotalPages(d.meta?.totalPages ?? 1);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleAction = async () => {
    if (!modal) return;
    setActing(true);
    try {
      const { action, id } = modal;
      const res = await fetch(`${API}/api/admin/customers/${id}/${action === "delete" ? "" : action}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: action === "delete" ? undefined : "{}",
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast(`Customer ${action}d`, "success");
      fetchCustomers();
    } catch (err: any) { toast(err.message || "Action failed", "error"); }
    finally { setActing(false); setModal(null); }
  };

  return (
    <AdminLayout title="Customers">
      <div className="max-w-5xl space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search name or email…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field" style={{ paddingLeft: "2.5rem" }} />
          </div>
          <div className="flex gap-2">
            {(["all","active","blocked"] as Status[]).map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className="px-3 py-2 rounded-lg text-xs font-mono capitalize transition-all"
                style={{
                  background: status === s ? "rgba(6,182,212,0.12)" : "var(--bg-input)",
                  border: status === s ? "1px solid rgba(6,182,212,0.3)" : "1px solid var(--border-default)",
                  color: status === s ? "#06B6D4" : "var(--text-muted)",
                }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={fetchCustomers} className="p-2 rounded-lg transition-all"
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
                {["Customer","Email","Status","Joined","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="shimmer h-10 rounded-lg" /></td></tr>
              )) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No customers found.</td></tr>
              ) : customers.map((c) => (
                <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b transition-colors" style={{ borderColor: "var(--border-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "rgba(6,182,212,0.12)", color: "#06B6D4" }}>
                        {c.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {c.isBlocked
                      ? <span className="badge badge-danger">Blocked</span>
                      : <span className="badge badge-success">Active</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {c.isBlocked
                        ? <button onClick={() => setModal({ action: "unblock", id: c._id, name: c.name })}
                            title="Unblock" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                            <ShieldCheck size={12} />
                          </button>
                        : <button onClick={() => setModal({ action: "block", id: c._id, name: c.name })}
                            title="Block" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
                            <ShieldOff size={12} />
                          </button>
                      }
                      <button onClick={() => setModal({ action: "delete", id: c._id, name: c.name })}
                        title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

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
        title={`${modal?.action?.charAt(0).toUpperCase() ?? ""}${modal?.action?.slice(1) ?? ""} Customer`}
        message={modal?.action === "delete"
          ? `Permanently delete "${modal.name}"? This cannot be undone.`
          : `${modal?.action === "block" ? "Block" : "Unblock"} "${modal?.name}"?`}
        confirmLabel={modal?.action?.charAt(0).toUpperCase() + (modal?.action?.slice(1) ?? "")}
        danger={["delete","block"].includes(modal?.action ?? "")}
        loading={acting}
        onConfirm={handleAction}
        onCancel={() => setModal(null)}
      />
    </AdminLayout>
  );
}

export default function CustomersPage() {
  return <ToastProvider><CustomersContent /></ToastProvider>;
}

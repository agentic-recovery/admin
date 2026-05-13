"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, ShieldOff, ShieldCheck, Trash2, MapPin, Truck, FileText, ExternalLink, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ToastProvider, useToast } from "@/components/admin/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function DocPreview({ label, url }: { label: string; url?: string | null }) {
  if (!url) return (
    <div className="rounded-xl p-4" style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
      <p className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Not uploaded</p>
    </div>
  );
  const isPdf = url.endsWith(".pdf") || url.includes("/raw/");
  const isImg = /\.(jpg|jpeg|png|webp)/i.test(url) || url.includes("/image/");
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
      {isImg && (
        <img src={url} alt={label} className="w-full max-h-48 object-contain"
          style={{ background: "var(--bg-input)" }} />
      )}
      <div className="p-3 flex items-center justify-between" style={{ background: "var(--bg-input)" }}>
        <div className="flex items-center gap-2">
          <FileText size={13} style={{ color: isPdf ? "#EF4444" : "var(--text-muted)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "var(--accent-indigo)" }}>
          View <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

function ProviderDetailContent({ params }: { params: { id: string } }) {
  const router   = useRouter();
  const { toast } = useToast();
  const [provider, setProvider] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<{ action: string } | null>(null);
  const [acting,   setActing]   = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch(`${API}/api/admin/providers/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProvider(d.data))
      .finally(() => setLoading(false));
  }, [params.id]);

  const doAction = async (action: string) => {
    setActing(true);
    try {
      const body = action === "reject" ? JSON.stringify({ reason: rejectReason }) : "{}";
      const res = await fetch(`${API}/api/admin/providers/${params.id}/${action === "delete" ? "" : action}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        credentials: "include", headers: { "Content-Type": "application/json" }, body: action === "delete" ? undefined : body,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast(`Provider ${action}d`, "success");
      if (action === "delete") { router.push("/admin/providers"); return; }
      setProvider(d.data ?? provider);
    } catch (err: any) { toast(err.message || "Action failed", "error"); }
    finally { setActing(false); setModal(null); }
  };

  if (loading) return (
    <AdminLayout title="Provider Details">
      <div className="max-w-3xl space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shimmer h-32 rounded-2xl" />
        ))}
      </div>
    </AdminLayout>
  );

  if (!provider) return (
    <AdminLayout title="Provider Details">
      <div className="flex items-center gap-2 text-red-400"><AlertCircle size={16} />Provider not found.</div>
    </AdminLayout>
  );

  const p = provider;
  const statusBadge = p.isBlocked
    ? <span className="badge badge-danger">Blocked</span>
    : p.isApproved ? <span className="badge badge-success">Approved</span>
    : <span className="badge badge-warning">Pending</span>;

  return (
    <AdminLayout title="Provider Details">
      <div className="max-w-3xl space-y-5">
        {/* Back */}
        <button onClick={() => router.push("/admin/providers")}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
          <ArrowLeft size={14} /> Back to Providers
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(91,91,214,0.12)", border: "1px solid rgba(91,91,214,0.2)" }}>
              {p.logoUrl ? <img src={p.logoUrl} className="w-full h-full object-cover" alt="logo" />
                : <Truck size={22} className="text-indigo-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{p.companyName}</h2>
                {statusBadge}
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p.email}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Contact",    value: p.contactNumber ?? "—" },
              { label: "City",       value: p.city ?? p.serviceArea?.city ?? "—" },
              { label: "Postcode",   value: p.postcode ?? "—" },
              { label: "Provider Type", value: p.providerType ?? "—" },
              { label: "License No.",   value: p.licenseNumber ?? "—" },
              { label: "Vehicle Reg.",  value: p.carRegistration ?? "—" },
              { label: "Vehicles",      value: (p.vehicleTypes ?? []).join(", ") || "—" },
              { label: "Total Jobs",    value: p.stats?.completedJobs ?? 0 },
              { label: "Rating",        value: p.stats?.averageRating ? p.stats.averageRating.toFixed(1) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                <p className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Verification Documents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocPreview label="License Image"     url={p.licenseImageUrl} />
            <DocPreview label="Insurance Document" url={p.insuranceDocUrl} />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Admin Actions
          </p>
          <div className="flex flex-wrap gap-3">
            {!p.isApproved && !p.isBlocked && (
              <>
                <button onClick={() => setModal({ action: "approve" })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}>
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => setModal({ action: "reject" })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>
                  <X size={14} /> Reject
                </button>
              </>
            )}
            {p.isBlocked
              ? <button onClick={() => setModal({ action: "unblock" })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}>
                  <ShieldCheck size={14} /> Unblock
                </button>
              : <button onClick={() => setModal({ action: "block" })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
                  <ShieldOff size={14} /> Block
                </button>}
            <button onClick={() => setModal({ action: "delete" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>

          {modal?.action === "reject" && (
            <div className="mt-4">
              <label className="text-xs font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "var(--text-muted)" }}>Rejection Reason</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                rows={2} placeholder="Explain why this provider is being rejected…"
                className="input-field resize-none" />
            </div>
          )}
        </motion.div>
      </div>

      <ConfirmModal
        open={!!modal}
        title={`${modal?.action?.charAt(0).toUpperCase() ?? ""}${modal?.action?.slice(1) ?? ""} Provider`}
        message={modal?.action === "delete"
          ? "Permanently delete this provider account? This cannot be undone."
          : modal?.action === "approve"
          ? "Approve this provider? They will receive an email and can start accepting jobs."
          : modal?.action === "reject"
          ? `Reject this provider? They will be notified by email.`
          : `${modal?.action} this provider?`}
        confirmLabel={modal?.action?.charAt(0).toUpperCase() + (modal?.action?.slice(1) ?? "")}
        danger={["delete","block","reject"].includes(modal?.action ?? "")}
        loading={acting}
        onConfirm={() => doAction(modal!.action)}
        onCancel={() => setModal(null)}
      />
    </AdminLayout>
  );
}

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
  return <ToastProvider><ProviderDetailContent params={params} /></ToastProvider>;
}

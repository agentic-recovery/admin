"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Truck, Clock, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAppSelector } from "@/store";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function StatCard({ label, value, sub, icon, color, loading }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string; loading?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
          {icon}
        </div>
      </div>
      {loading
        ? <div className="shimmer h-7 w-16 rounded mb-1" />
        : <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>}
      <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const p = stats?.providers  ?? {};
  const c = stats?.customers  ?? {};
  const r = stats?.requests   ?? {};
  const chart = stats?.signupChart ?? [];

  const statCards = [
    { label: "Total Providers",   value: p.total ?? 0,         sub: `${p.newToday ?? 0} new today`,         icon: <Truck size={15} />,        color: "#7C7CE8" },
    { label: "Pending Approval",  value: p.pendingApproval ?? 0, sub: "Awaiting review",                     icon: <Clock size={15} />,        color: "#F59E0B" },
    { label: "Total Customers",   value: c.total ?? 0,          sub: `${c.newToday ?? 0} new today`,         icon: <Users size={15} />,        color: "#06B6D4" },
    { label: "Completed Jobs",    value: r.completed ?? 0,       sub: `${r.total ?? 0} total requests`,      icon: <CheckCircle size={15} />,  color: "#10B981" },
    { label: "Blocked Accounts",  value: (p.blocked ?? 0) + (c.blocked ?? 0), sub: "Providers + customers", icon: <AlertTriangle size={15} />, color: "#EF4444" },
    { label: "Approved Providers",value: p.approved ?? 0,        sub: `of ${p.total ?? 0} total`,           icon: <TrendingUp size={15} />,   color: "#8B5CF6" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-6xl space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
        </div>

        {/* Signup chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
            New Signups — Last 7 Days
          </p>
          {loading ? (
            <div className="shimmer h-48 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "var(--text-muted)" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} />
                <Bar dataKey="providers" name="Providers" fill="#7C7CE8" radius={[4,4,0,0]} maxBarSize={32} />
                <Bar dataKey="customers" name="Customers" fill="#06B6D4" radius={[4,4,0,0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Pending Approvals", value: p.pendingApproval ?? 0, href: "/admin/providers?status=pending",  color: "#F59E0B", desc: "Providers awaiting approval" },
            { label: "Blocked Providers",  value: p.blocked ?? 0,         href: "/admin/providers?status=blocked",  color: "#EF4444", desc: "Currently blocked accounts" },
          ].map(({ label, value, href, color, desc }) => (
            <motion.a key={label} href={href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer"
              style={{ background: "var(--bg-card)", border: `1px solid ${color}30` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${color}30`)}>
              <p className="font-display text-3xl font-bold" style={{ color }}>{value}</p>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

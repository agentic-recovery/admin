"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Truck, LogOut, Zap,
  ShieldAlert, ChevronLeft, ChevronRight, Bell,
} from "lucide-react";
import { useAppDispatch, useAppSelector, bootstrapAdmin, logoutAdmin, clearAdmin } from "@/store";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/admin/dashboard" },
  { icon: Truck,           label: "Providers",  href: "/admin/providers" },
  { icon: Users,           label: "Customers",  href: "/admin/customers" },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const router   = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { admin } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    dispatch(clearAdmin());
    router.push("/admin-portal-access-xyz/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex flex-col flex-shrink-0 relative z-20 border-r"
      style={{ background: "var(--bg-nav)", borderColor: "var(--border-subtle)", backdropFilter: "blur(24px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b min-h-[72px]"
        style={{ borderColor: "var(--border-subtle)" }}>
        <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={16} className="text-red-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="overflow-hidden whitespace-nowrap">
              <p className="font-display text-sm font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</p>
              <p className="font-mono text-[10px] text-red-400/70 tracking-wider">AI RECOVERY</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin badge */}
      <AnimatePresence>
        {!collapsed && admin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-3 my-3 p-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{admin.name}</p>
            <p className="font-mono text-[9px] mt-0.5 text-red-400/70 uppercase tracking-wider">
              {admin.isSuperAdmin ? "Super Admin" : "Admin"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative"
              style={{
                background: active ? "rgba(239,68,68,0.15)" : "transparent",
                border: active ? "1px solid rgba(239,68,68,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-400 rounded-r-full" />}
              <Icon size={16} className="flex-shrink-0" style={{ color: active ? "#F87171" : "var(--text-muted)" }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all"
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <LogOut size={16} className="flex-shrink-0 group-hover:text-red-400 transition-colors"
            style={{ color: "var(--text-muted)" }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm group-hover:text-red-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}>Sign Out</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse */}
      <button onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-30 transition-all"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-muted)" }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}

export default function AdminLayout({
  children, title,
}: { children: React.ReactNode; title: string }) {
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const { admin, bootstrapped } = useAppSelector((s) => s.auth);
  const bootstrapRan = useRef(false);
  const [col, setCol] = useState(false);

  useEffect(() => {
    if (bootstrapRan.current) return;
    bootstrapRan.current = true;
    dispatch(bootstrapAdmin());
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!bootstrapped) return;
    if (!admin) router.replace("/admin-portal-access-xyz/login");
  }, [bootstrapped, admin]); // eslint-disable-line

  if (!bootstrapped || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />
      <Sidebar collapsed={col} onToggle={() => setCol(!col)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top bar */}
        <header className="h-[72px] border-b flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: "var(--bg-nav)", borderColor: "var(--border-subtle)", backdropFilter: "blur(24px)" }}>
          <div>
            <h1 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{title}</h1>
            <p className="font-mono text-[10px] tracking-wider text-red-400/60">ADMIN PANEL</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
              <ShieldAlert size={11} /> Admin Mode
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

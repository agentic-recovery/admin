"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldAlert, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector, loginAdmin, clearError } from "@/store";

export default function AdminLogin() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #060610 0%, #0A0A1A 60%, rgba(239,68,68,0.05) 100%)" }}>
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 0 40px rgba(239,68,68,0.15)" }}>
            <ShieldAlert size={24} className="text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>AI Recovery Management Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7"
          style={{ background: "rgba(19,19,42,0.9)", border: "1px solid rgba(239,68,68,0.15)", backdropFilter: "blur(24px)" }}>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
              <AlertCircle size={14} />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "rgba(255,255,255,0.4)" }}>Email</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@airecovery.co.uk" required
                  className="input-field" style={{ paddingLeft: "2.5rem" }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider block mb-1.5"
                style={{ color: "rgba(255,255,255,0.4)" }}>Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }} />
                <input type={showPw ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 10 characters" required
                  className="input-field" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239,68,68,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><ShieldAlert size={14} />Sign In to Admin Panel <ArrowRight size={14} /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
            First time? <a href="/admin-portal-access-xyz/register"
              className="text-red-400/70 hover:text-red-400 transition-colors">Create admin account</a>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.1)" }}>
          This page is not publicly listed. Authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
}

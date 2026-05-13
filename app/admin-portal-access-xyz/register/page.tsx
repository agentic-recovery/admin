"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector, registerAdmin, clearError } from "@/store";

export default function AdminRegister() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())           e.name = "Name is required";
    if (!form.email.includes("@"))   e.email = "Valid email required";
    if (form.password.length < 10)   e.password = "Minimum 10 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setFieldErr(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;
    const result = await dispatch(registerAdmin({ name: form.name, email: form.email, password: form.password }));
    if (registerAdmin.fulfilled.match(result)) router.push("/admin/dashboard");
  };

  const Field = ({ k, label, type = "text", placeholder, icon }: { k: string; label: string; type?: string; placeholder: string; icon: React.ReactNode }) => (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider block mb-1.5"
        style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "rgba(255,255,255,0.3)" }}>{icon}</div>
        <input type={type} value={(form as any)[k]} onChange={set(k)} placeholder={placeholder}
          className="input-field" style={{ paddingLeft: "2.5rem", borderColor: fieldErr[k] ? "rgba(239,68,68,0.5)" : undefined }} />
      </div>
      {fieldErr[k] && <p className="text-xs text-red-400 mt-1">{fieldErr[k]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #060610 0%, #0A0A1A 60%, rgba(239,68,68,0.05) 100%)" }}>
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <ShieldAlert size={24} className="text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Create Admin Account</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>First-time setup only</p>
        </div>

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
            <Field k="name"     label="Full Name" placeholder="Admin Name"       icon={<User size={13} />} />
            <Field k="email"    label="Email"     placeholder="admin@example.com" icon={<Mail size={13} />} type="email" />
            <Field k="password" label="Password (min 10 chars)" placeholder="Strong password"  icon={<Lock size={13} />} type="password" />
            <Field k="confirm"  label="Confirm Password" placeholder="Repeat password" icon={<Lock size={13} />} type="password" />

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><ShieldAlert size={14} /> Create Admin Account <ArrowRight size={14} /></>}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
            Already have an account?{" "}
            <a href="/admin-portal-access-xyz/login" className="text-red-400/70 hover:text-red-400 transition-colors">Sign in</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

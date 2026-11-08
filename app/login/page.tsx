"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/book";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed.");
      router.push(data.user.role === "admin" ? "/admin" : next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-8 sm:pt-12">
      <div className="card animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">Doggie Do&apos;s Pet Salon</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Login is required to book an appointment.</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button variant="accent" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">No account? <Link href="/signup" className="font-semibold text-amber-700">Create one</Link></p>
        <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-slate-600">Demo — Admin: admin@doggiedos.example / Admin123! &nbsp;•&nbsp; Dog Parent: patient@demo.example / Patient123!</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 pt-12"><div className="card"><div className="skeleton h-8 w-2/3" /><div className="skeleton mt-4 h-11 w-full" /><div className="skeleton mt-3 h-11 w-full" /></div></div>}>
      <LoginForm />
    </Suspense>
  );
}

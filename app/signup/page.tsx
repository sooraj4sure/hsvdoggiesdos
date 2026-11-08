"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, email, password }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Signup failed.");
    router.push("/book");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-8 sm:pt-10">
      <div className="card animate-fade-in">
        <p className="eyebrow">Doggie Do&apos;s Pet Salon</p>
        <h1 className="mt-1 break-words text-2xl font-bold text-slate-900 sm:text-3xl">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Your WhatsApp number is used for booking confirmations.</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div><label className="label">Full name</label><input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label">WhatsApp number (with country code)</label><input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" /></div>
          <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label">Password (min 6 characters)</label><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button variant="accent" className="w-full">
            Sign up &amp; continue to booking
          </Button>
        </form>
        <p className="mt-3 text-sm">Already have an account? <Link href="/login" className="font-semibold text-amber-700">Login</Link></p>
      </div>
    </div>
  );
}

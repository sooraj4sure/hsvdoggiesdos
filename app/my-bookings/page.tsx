"use client";
import { useEffect, useState } from "react";
import { formatTime12 } from "@/lib/slots";

const badge: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Completed: "bg-amber-100 text-amber-800",
  "No-Show": "bg-stone-200 text-stone-700",
};

export default function MyBookingsPage() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => { load(); }, []);
  async function load() {
    const res = await fetch("/api/appointments");
    const d = await res.json();
    setList(d.appointments || []);
  }
  const filtered = list.filter((a) => !q || a.bookingId.toLowerCase().includes(q.toLowerCase()) || a.patientPhone.includes(q));
  return (
    <div className="space-y-6 pt-6 sm:pt-8">
      <div>
        <p className="eyebrow">Your visits</p>
        <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          My Bookings
        </h1>
      </div>
      <input className="input w-full sm:max-w-sm" placeholder="Check by Booking ID or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.length === 0 && <p className="text-slate-500">No bookings yet. <a href="/book" className="font-semibold text-amber-700">Book one now</a>.</p>}
      <div className="grid gap-3">
        {filtered.map((a) => (
          <div key={a._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words font-semibold text-slate-900">{a.doctorId?.name} • {a.date} • {formatTime12(a.slotStart)} - {formatTime12(a.slotEnd)}</p>
              <p className="mt-0.5 break-words text-sm text-slate-500">Booking ID: {a.bookingId} • Slot No. {a.slotNo} • Reason: {a.reason}{a.breed ? ` • Breed: ${a.breed}` : ""} • Fee: ${a.fee}</p>
            </div>
            <span className={`badge shrink-0 ${badge[a.status] || ""}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { formatTime12 } from "@/lib/slots";
import { Button } from "@/components/Button";
import Reveal from "@/components/Reveal";

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Completed: "bg-amber-100 text-amber-800",
  "No-Show": "bg-stone-200 text-stone-600",
};

export default function AdminPatientsPage() {
  const [q, setQ] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search() {
    setLoading(true);
    const d = await fetch(`/api/admin/patients?q=${encodeURIComponent(q)}`).then((r) => r.json());
    setList(d.appointments || []);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="min-w-0">
        <p className="eyebrow">Admin Panel</p>
        <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Dog Parents
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
          Look up a dog parent by phone number or name to see every visit they have booked — groomer,
          date, reason and status.
        </p>
      </header>

      <Reveal>
        <section className="card">
          <label className="label" htmlFor="patient-search">
            Search by phone number or name
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="patient-search"
              className="input min-w-0 flex-1"
              placeholder="e.g. +1 555 123 4567 or Priya…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <Button className="w-full sm:w-auto" onClick={search} disabled={!q.trim()}>
              Search
            </Button>
          </div>
        </section>
      </Reveal>

      {loading ? (
        <div className="card-pad space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-5 w-full" />
          ))}
        </div>
      ) : !searched ? (
        <div className="card-pad text-center">
          <p className="text-lg font-bold text-slate-900">Search for a dog parent</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
            Enter a phone number or a name above. Their past visits will appear here as a list.
          </p>
        </div>
      ) : list.length === 0 ? (
        <div className="card-pad text-center">
          <p className="text-lg font-bold text-slate-900">No visits found</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
            No bookings match “{q}”. Check the spelling or phone number and try again.
          </p>
        </div>
      ) : (
        <Reveal>
          <section className="card overflow-hidden !p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-3 pt-5">
              <h2 className="text-lg font-bold text-slate-900">
                {list.length} visit{list.length === 1 ? "" : "s"} found
              </h2>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                {list[0]?.patientName} • {list[0]?.patientPhone}
              </span>
            </div>
            {/* Table scrolls horizontally inside the card on mobile — never cut off. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-y border-stone-100 bg-cream text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Time</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Groomer</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reason</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Booking ID</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((a) => (
                    <tr key={a._id} className="border-b border-stone-100 last:border-0 hover:bg-amber-50/40">
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">{a.date}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{formatTime12(a.slotStart)}</td>
                      <td className="px-4 py-3.5 text-slate-700">{a.doctorId?.name}</td>
                      <td className="px-4 py-3.5 text-slate-700">{a.reason}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-500">{a.bookingId}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${STATUS_BADGE[a.status] || "bg-stone-200 text-stone-600"}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>
      )}

      <p className="text-sm">
        <Link href="/admin" className="font-semibold text-amber-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </p>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppointmentRow from "@/components/AppointmentRow";
import { Button } from "@/components/Button";
import Reveal from "@/components/Reveal";

const FILTERS = ["All", "Pending", "Confirmed", "Rejected", "Completed", "No-Show"];

export default function AdminAppointmentsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "All") params.set("status", filter);
    if (q) params.set("q", q);
    if (date) params.set("date", date);
    const d = await fetch(`/api/appointments?${params}`).then((r) => r.json());
    setList(d.appointments || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Group by groomer for the admin view.
  const grouped: Record<string, any[]> = {};
  list.forEach((a) => {
    const k = a.doctorId?.name || "Unknown groomer";
    (grouped[k] = grouped[k] || []).push(a);
  });
  const pendingCount = list.filter((a) => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Appointments
          </h1>
          <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
            Every booking, grouped by groomer. Confirm or reject a pending booking, then message the
            client on WhatsApp.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="shrink-0 rounded-full bg-amber-100 px-3.5 py-2 text-sm font-bold text-amber-800">
            {pendingCount} awaiting decision
          </span>
        )}
      </header>

      <Reveal>
        <section className="card space-y-4">
          <div className="chip-row" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`chip shrink-0 font-semibold ${
                  filter === f ? "bg-amber-700 text-white" : "bg-white hover:border-amber-700 hover:text-amber-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1">
              <label className="label" htmlFor="appt-date">
                Date
              </label>
              <input
                id="appt-date"
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label className="label" htmlFor="appt-search">
                Search
              </label>
              <input
                id="appt-search"
                className="input"
                placeholder="Name / phone / booking ID…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full sm:w-auto" variant="outline" onClick={load}>
                Search
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-pad">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton mt-3 h-4 w-full" />
              <div className="skeleton mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card-pad text-center">
          <p className="text-lg font-bold text-slate-900">No appointments match</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
            Try a different status, date or search — or clear the filters to see every booking.
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setFilter("All");
                setQ("");
                setDate("");
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([doctor, items]) => (
          <section key={doctor} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-bold text-slate-900">{doctor}</h2>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                {items.length} appointment{items.length === 1 ? "" : "s"}
              </span>
              {items.some((a) => a.status === "Pending") && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  {items.filter((a) => a.status === "Pending").length} pending
                </span>
              )}
            </div>
            {items.map((a) => (
              <AppointmentRow key={a._id} a={a} onChange={load} />
            ))}
          </section>
        ))
      )}

      <p className="text-sm">
        <Link href="/admin" className="font-semibold text-amber-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </p>
    </div>
  );
}

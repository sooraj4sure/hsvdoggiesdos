"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTime12 } from "@/lib/slots";
import { Button } from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function AdminAvailabilityPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isOff, setIsOff] = useState(false);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [leaveTo, setLeaveTo] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors || []));
  }, []);

  async function loadSlots() {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    const d = await fetch(`/api/availability?doctorId=${doctorId}&date=${date}`).then((r) => r.json());
    setSlots(d.slots || []);
    setIsOff(!!d.isOff);
    setBlocked(d.blockedSlots || []);
    setLoadingSlots(false);
  }
  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, date]);

  async function save() {
    const dates =
      leaveTo && leaveTo > date
        ? (() => {
            const out: string[] = [];
            const cur = new Date(date + "T12:00:00");
            const end = new Date(leaveTo + "T12:00:00");
            while (cur <= end) {
              out.push(cur.toISOString().slice(0, 10));
              cur.setDate(cur.getDate() + 1);
            }
            return out;
          })()
        : [date];
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, dates, isOff, blockedSlots: blocked }),
    });
    setMsg(res.ok ? `Saved for ${dates.length} day(s).` : "Could not save.");
    loadSlots();
  }

  function toggleBlock(s: string) {
    setBlocked((b) => (b.includes(s) ? b.filter((x) => x !== s) : [...b, s]));
  }

  const doctor = doctors.find((d) => d._id === doctorId);

  return (
    <div className="space-y-6">
      <header className="min-w-0">
        <p className="eyebrow">Admin Panel</p>
        <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Availability
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
          Only groomers available on a date show on the website. Mark a groomer off, block single
          slots, or set a leave range.
        </p>
      </header>

      <Reveal>
        <section className="card space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0">
              <label className="label" htmlFor="avail-doctor">
                Groomer
              </label>
              <select
                id="avail-doctor"
                className="input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                <option value="">Select groomer…</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.specialisation}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="label" htmlFor="avail-date">
                Date
              </label>
              <input
                id="avail-date"
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="min-w-0">
              <label className="label" htmlFor="avail-leave-to">
                Leave until <span className="font-normal normal-case text-slate-400">(optional)</span>
              </label>
              <input
                id="avail-leave-to"
                className="input"
                type="date"
                value={leaveTo}
                onChange={(e) => setLeaveTo(e.target.value)}
              />
            </div>
          </div>
          <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-[15px] font-medium text-slate-800">
            <input
              type="checkbox"
              className="h-5 w-5 shrink-0 accent-amber-700"
              checked={isOff}
              onChange={(e) => setIsOff(e.target.checked)}
            />
            Groomer is off this day / range — hide them from the website
          </label>
          {msg && (
            <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {msg}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" onClick={save} disabled={!doctorId}>
              Save Availability
            </Button>
            <Link href="/admin" className="btn-outline w-full sm:w-auto">
              Back to Dashboard
            </Link>
          </div>
        </section>
      </Reveal>

      {!doctorId ? (
        <div className="card-pad text-center">
          <p className="text-lg font-bold text-slate-900">Pick a groomer to see their slots</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
            Choose a groomer and a date above — their free slots for that day appear here, ready to
            block or open.
          </p>
        </div>
      ) : (
        <Reveal>
          <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-slate-900">
                  Slots on {date} {isOff ? "— day off" : ""}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {doctor?.name} • Click a slot to block / unblock it. Blocked slots disappear from
                  the website; booked slots are already hidden.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                {loadingSlots ? "…" : `${slots.length} free slots`}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
              <span className="rounded-full border border-stone-300 bg-white px-3 py-1.5">White = free</span>
              <span className="rounded-full border border-red-400 bg-red-100 px-3 py-1.5 text-red-800">
                Red = blocked
              </span>
            </div>
            {loadingSlots ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton h-11 w-24" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center">
                <p className="font-bold text-slate-800">No free slots on this date</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  This groomer is off, fully booked, or has no working hours that day. Try another
                  date or groomer.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s.slotStart}
                    type="button"
                    aria-pressed={blocked.includes(s.slotStart)}
                    onClick={() => toggleBlock(s.slotStart)}
                    className={`inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                      blocked.includes(s.slotStart)
                        ? "border-red-400 bg-red-100 text-red-800"
                        : "border-stone-300 bg-white text-slate-700 hover:border-stone-400"
                    }`}
                  >
                    {formatTime12(s.slotStart)}
                    {blocked.includes(s.slotStart) ? " • Blocked" : ""}
                  </button>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}
    </div>
  );
}

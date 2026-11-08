"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatTime12 } from "@/lib/slots";
import { CLINIC } from "@/lib/constants";
import { DOG_BREEDS } from "@/lib/breeds";
import { Button } from "@/components/Button";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function BookPage() {
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState(todayStr());
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotStart, setSlotStart] = useState("");
  const [reason, setReason] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [breed, setBreed] = useState("");
  const [breedOther, setBreedOther] = useState("");
  const [notes, setNotes] = useState("");
  const [visitType, setVisitType] = useState("First Visit");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [step, setStep] = useState<"form" | "summary">("form");
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user) router.push("/login?next=/book");
      else setUser(d.user);
    });
    fetch("/api/reasons").then((r) => r.json()).then((d) => setReasons(d.reasons || []));
  }, [router]);

  useEffect(() => {
    if (!date) return;
    setDoctorId(""); setSlots([]); setSlotStart(""); setLoadingDoctors(true);
    fetch(`/api/doctors?date=${date}`).then((r) => r.json()).then((d) => setDoctors(d.doctors || [])).finally(() => setLoadingDoctors(false));
  }, [date]);

  useEffect(() => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    fetch(`/api/availability?doctorId=${doctorId}&date=${date}`).then((r) => r.json()).then((d) => setSlots(d.slots || [])).finally(() => setLoadingSlots(false));
  }, [doctorId, date]);

  const doctor = doctors.find((d) => d._id === doctorId);
  const slot = slots.find((s) => s.slotStart === slotStart);
  const fee = doctor ? (visitType === "Follow-up" && doctor.followUpFee ? doctor.followUpFee : doctor.fee) : 0;
  const breedFinal = breed === "Other" ? breedOther.trim() : breed;
  const canReview = !!(doctorId && slotStart && reason && breedFinal && patientPhone);

  async function submit() {
    setError("");
    const res = await fetch("/api/appointments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, date, slotStart, reason, breed: breedFinal, notes, visitType, patientName: patientName || user?.name, patientPhone }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Booking failed.");
    setDone(data.appointment);
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-lg px-0 pt-8">
        <div className="card animate-slide-up text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-700 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Request sent</h1>
          <p className="mt-2 text-slate-600">Your slot is locked as Pending. Booking ID: <strong className="text-slate-900">{done.bookingId}</strong></p>
          <p className="mt-1 text-sm text-slate-500">The salon will confirm soon and send the full details on WhatsApp to {done.patientPhone}.</p>
          <Button className="mt-5 w-full" onClick={() => router.push("/my-bookings")}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  const minDate = todayStr();
  const maxDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  if (step === "summary" && doctor && slot) {
    return (
      <div className="mx-auto w-full max-w-lg pt-6 sm:pt-8">
        <div className="card animate-slide-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">Check before you confirm</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Please check your booking</h1>
          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-[15px]">
            {[["Groomer", `${doctor.name} — ${doctor.specialisation}`], ["Date", date], ["Time", `${formatTime12(slot.slotStart)} – ${formatTime12(slot.slotEnd)}`], ["Slot No.", String(slot.slotNo)], ["Reason", reason], ["Breed", breedFinal], ["Visit", visitType], ["Fee", `$${fee}`], ["Dog Parent", patientName || user?.name || "—"], ["WhatsApp", patientPhone]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold text-slate-900">{v}</dd></div>
            ))}
          </dl>
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
              Edit
            </Button>
            <Button variant="accent" className="flex-1" onClick={submit}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in space-y-5 pt-6 sm:pt-8">
      <div>
        <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Book a Grooming Session
        </h1>
        <p className="mt-1 text-sm text-slate-500">Login is required to book. Past dates and Sundays are not available.</p>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="label" htmlFor="book-date">1. Pick a date</label>
          <input id="book-date" className="input" type="date" min={minDate} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <p className="label">2. Pick a groomer</p>
          <p className="mb-2 text-xs text-slate-500">Only groomers available on {date} are shown.</p>
          {loadingDoctors ? (
            <div className="space-y-2"><div className="skeleton h-[72px] w-full" /><div className="skeleton h-[72px] w-full" /></div>
          ) : doctors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-slate-700">No groomers available on this date</p>
              <p className="mt-1 text-xs text-slate-500">Try another date — some groomers work only on certain days, and Sundays are closed.</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {doctors.map((d) => (
                <button key={d._id} type="button" onClick={() => setDoctorId(d._id)} aria-pressed={doctorId === d._id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.99] ${doctorId === d._id ? "border-amber-700 bg-amber-50 ring-2 ring-amber-700/15" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <Image src={d.photo} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-slate-900">{d.name}</span>
                    <span className="block text-xs text-slate-500">{d.specialisation} • ${d.fee} • {d.slotDurationMinutes} mins</span>
                    <span className="block text-xs font-medium text-amber-700">Next available: {d.nextAvailable?.date}, {d.nextAvailable ? formatTime12(d.nextAvailable.slot.slotStart) : "—"}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {doctorId && (
          <div>
            <p className="label">3. Pick a free slot</p>
            <p className="mb-2 text-xs text-slate-500">One slot = one appointment. Booked slots are hidden.</p>
            {loadingSlots ? (
              <div className="chip-row"><div className="skeleton h-11 w-24 shrink-0" /><div className="skeleton h-11 w-24 shrink-0" /><div className="skeleton h-11 w-24 shrink-0" /></div>
            ) : slots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-slate-700">No slots available on this date</p>
                <p className="mt-1 text-xs text-slate-500">This groomer is fully booked or off that day. Pick another groomer or date.</p>
              </div>
            ) : (
              <div className="chip-row">
                {slots.map((s) => (
                  <button key={s.slotStart} type="button" onClick={() => setSlotStart(s.slotStart)} aria-pressed={slotStart === s.slotStart}
                    className={`chip shrink-0 ${slotStart === s.slotStart ? "chip-selected" : ""}`}>
                    {formatTime12(s.slotStart)} – {formatTime12(s.slotEnd)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {slotStart && (
          <div className="animate-slide-up space-y-4 border-t border-slate-100 pt-4">
            <div>
              <label className="label" htmlFor="reason">4. Pick a grooming service</label>
              <select id="reason" className="input" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select a service…</option>
                {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="breed">5. Select your dog&apos;s breed</label>
              <select id="breed" className="input" value={breed} onChange={(e) => { setBreed(e.target.value); setBreedOther(""); }}>
                <option value="">Select a breed…</option>
                {DOG_BREEDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {breed === "Other" && (
                <input
                  className="input mt-2"
                  value={breedOther}
                  onChange={(e) => setBreedOther(e.target.value)}
                  placeholder="Type your dog's breed…"
                  aria-label="Your dog's breed"
                />
              )}
              <p className="mt-1.5 text-xs text-slate-500">The groomer sees the breed before your visit, so the right tools and time are ready.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="visit-type">Visit type</label>
                <select id="visit-type" className="input" value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                  <option>First Visit</option><option>Follow-up</option>
                </select>
              </div>
              <div>
                <label className="label">Fee</label>
                <input className="input bg-slate-50" readOnly value={`$${fee}`} aria-label="Grooming fee" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="patient-name">Your name</label>
              <input id="patient-name" className="input" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder={user?.name || "Full name"} />
            </div>
            <div>
              <label className="label" htmlFor="patient-phone">WhatsApp number (with country code)</label>
              <input id="patient-phone" className="input" inputMode="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label className="label" htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" className="input min-h-[44px]" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the groomer should know about your pet?" />
            </div>
          </div>
        )}

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Button variant="accent" className="hidden w-full md:inline-flex" disabled={!canReview} onClick={() => setStep("summary")}>
          Review Booking
        </Button>
        <p className="text-center text-sm text-slate-500">
          Need help?{" "}
          <a href={`tel:${CLINIC.phoneRaw}`} className="font-semibold text-amber-700">
            Call the salon: {CLINIC.phone}
          </a>
        </p>
      </div>

      {/* Sticky bottom CTA on mobile — thumb-friendly, always reachable. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Button variant="accent" className="w-full" disabled={!canReview} onClick={() => setStep("summary")}>
          {canReview ? `Review Booking — $${fee}` : "Pick a groomer & slot to continue"}
        </Button>
      </div>
    </div>
  );
}

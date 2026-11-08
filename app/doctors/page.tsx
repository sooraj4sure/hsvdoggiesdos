"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatTime12 } from "@/lib/slots";
import { ButtonLink } from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors || []))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="animate-fade-in space-y-8 pt-6 sm:pt-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Our Groomers</p>
        <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Ten groomers. Pick one and book a session.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          Only free slots are shown — pick a groomer, see their next available time, and book in under
          a minute. Lara and Diana, our sister groomers, lead the team.
        </p>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-pad">
              <div className="skeleton h-56 w-full" />
              <div className="skeleton mt-4 h-5 w-2/3" />
              <div className="skeleton mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="card-pad text-center">
          <p className="font-bold text-slate-800">No groomers available right now</p>
          <p className="mt-1 text-sm text-slate-500">Please check back later or call the salon.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <Reveal key={d._id} delay={(i % 3) * 90}>
              <article className="card-hover group flex h-full flex-col overflow-hidden !p-0">
                <div className="relative h-60 w-full overflow-hidden bg-mint">
                  <Image
                    src={d.photo}
                    alt={d.name}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-card">
                    {d.specialisation}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-slate-900">{d.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-600">{d.qualification}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {d.experienceYears} yrs experience • {(d.languages || []).join(", ")}
                  </p>
                  <p className="mt-3 text-[15px] text-slate-700">
                    Fee: <strong className="text-slate-900">${d.fee}</strong> • {d.slotDurationMinutes}{" "}
                    mins per slot
                  </p>
                  <p className="mt-1 text-sm font-semibold text-amber-700">
                    {d.nextAvailable
                      ? `Next available: ${d.nextAvailable.date}, ${formatTime12(d.nextAvailable.slot.slotStart)}`
                      : "No slots in the next 7 days"}
                  </p>
                  <div className="mt-5">
                    <ButtonLink href="/book" variant="outline" className="w-full">
                      Book with {d.name.split(" ").slice(0, 2).join(" ")}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

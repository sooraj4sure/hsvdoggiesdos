"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CLINIC } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { ButtonLink } from "@/components/Button";
import Reveal from "@/components/Reveal";
import { formatTime12 } from "@/lib/slots";

const STEPS = [
  {
    n: "1",
    title: "Pick a date",
    text: "Only groomers who are actually available that day are shown — no guessing, no phone calls.",
  },
  {
    n: "2",
    title: "Choose a groomer & slot",
    text: "See the time, duration and fee up front. One slot is one appointment, so it cannot be double-booked.",
  },
  {
    n: "3",
    title: "Get confirmed on WhatsApp",
    text: "Your slot locks as Pending, the salon confirms it, and the full details arrive on your WhatsApp.",
  },
];

const PRAISE_WORDS = ["Kind", "Gentle", "Patient", "Friendly", "Loving", "Flexible"];

export default function Home() {
  const [doctors, setDoctors] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors((d.doctors || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in space-y-16 pb-4 pt-6 sm:space-y-24 sm:pt-10">
      {/* Hero — photo on the left on desktop, on top on mobile.
          Image is order-1 and text is order-2 at every width.
          Headline wraps at every width; nothing is cut off. */}
      <section className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 order-2 lg:col-span-6">
          <p className="eyebrow">Dog Grooming • Huntsville, AL</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
            Book a grooming session for your dog in minutes.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A family-owned dog salon in Huntsville since 2009 — baths, haircuts, Dremel nail
            trims, cage-free daycare and boarding in spacious dog condos. Pick a date, see only
            the groomers who are free that day, choose a slot, and get confirmed on WhatsApp.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/book" variant="accent" className="w-full sm:w-auto">
              Book a Session
            </ButtonLink>
            <ButtonLink href="/doctors" variant="outline" className="w-full sm:w-auto">
              Meet Our Groomers
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <span className="text-base font-bold text-amber-500" aria-hidden>
                ★★★★★
              </span>
              <span>
                <strong className="text-slate-900">4.9</strong> on ThreeBestRated — #1 of the 3 Best
                Pet Grooming in Huntsville
              </span>
            </span>
            <span className="hidden h-4 w-px bg-stone-300 sm:block" aria-hidden />
            <span>Saturday grooming appointments</span>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-stone-200 pt-6">
            {[
              ["2009", "Family-owned since"],
              ["15", "Dog services"],
              ["4.9", "ThreeBestRated score"],
            ].map(([v, l]) => (
              <div key={l} className="min-w-0">
                <dt className="truncate text-2xl font-bold text-slate-900 sm:text-3xl">{v}</dt>
                <dd className="mt-0.5 text-xs leading-snug text-slate-500 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 order-1 lg:col-span-6">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src="/images/hero.jpg"
                alt="A happy freshly groomed dog at Doggie Do's Pet Salon"
                width={1400}
                height={933}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white px-5 py-4 shadow-lift sm:left-6 sm:right-auto sm:min-w-[320px]">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500" aria-hidden />
                  Open today
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{CLINIC.hours}</p>
              </div>
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="inline-flex h-12 min-h-[52px] shrink-0 items-center justify-center rounded-2xl bg-amber-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 sm:min-h-12"
              >
                Call Salon
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <Reveal>
        <section className="card-pad">
          <ul className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
            {[
              ["Dogs only", "Grooming, daycare & boarding — just dogs"],
              ["Watch them groom", "You're welcome to watch your dog being groomed"],
              ["One slot, one dog", "No double bookings, ever"],
              ["Cage-free daycare", "Dogs grouped by size and energy"],
            ].map(([t, s]) => (
              <li key={t} className="min-w-0">
                <p className="font-bold text-slate-900">{t}</p>
                <p className="mt-0.5 text-slate-500">{s}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* How booking works */}
      <Reveal>
        <section>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Three steps, and your visit is set
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <article className="card-hover h-full">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Services preview — image cards, not plain boxes */}
      <Reveal>
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">What we do</p>
              <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Happy, clean, good-looking dogs — all in one salon
              </h2>
            </div>
            <Link href="/services" className="shrink-0 text-[15px] font-semibold text-amber-700 hover:text-amber-800">
              All services →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 3).map((s, i) => (
              <Reveal key={s.slug} delay={i * 90}>
                <article className="card-hover group flex h-full flex-col overflow-hidden !p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      width={1000}
                      height={667}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-slate-600">{s.description}</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      {s.duration} • {s.fee}
                    </p>
                    <div className="mt-4">
                      <ButtonLink href="/book" variant="outline" className="w-full">
                        Book this service
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Doctors preview — real photos */}
      <Reveal>
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">Meet the team</p>
              <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Groomers you can actually book today
              </h2>
            </div>
            <Link href="/doctors" className="shrink-0 text-[15px] font-semibold text-amber-700 hover:text-amber-800">
              All 10 groomers →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d, i) => (
              <Reveal key={d._id} delay={i * 80}>
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
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold text-slate-900">{d.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {d.specialisation} • {d.experienceYears} yrs experience
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      Fee: <strong>${d.fee}</strong> • {d.slotDurationMinutes} mins
                    </p>
                    <p className="mt-1 text-sm font-semibold text-amber-700">
                      {d.nextAvailable
                        ? `Next available: ${d.nextAvailable.date}, ${formatTime12(d.nextAvailable.slot.slotStart)}`
                        : "No slots in the next 7 days"}
                    </p>
                    <div className="mt-4">
                      <ButtonLink href="/book" variant="outline" className="w-full">
                        Book with {d.name.split(" ").slice(0, 2).join(" ")}
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Why choose us — photo + checklist */}
      <Reveal>
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src="/images/clinic.jpg"
              alt="Dogs playing together at Doggie Do's Pet Salon"
              width={1200}
              height={817}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="eyebrow">Why Doggie Do&apos;s Pet Salon</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              A family salon that treats your dog like family
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                ["Your slot is really yours", "One slot means one appointment. Once you book, nobody else can take it."],
                ["Watch the groom", "You're welcome to watch your dog being groomed right in front of you."],
                ["Cage-free daycare", "Dogs play in groups matched by size and energy level, supervised all day."],
                ["Boarding in dog condos", "Spacious, comfortable dog condos — and our team stays on site overnight."],
              ].map(([t, s]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-900">{t}</span>
                    <span className="mt-0.5 block text-[15px] leading-relaxed text-slate-600">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* What dog parents say — the words Huntsville dog parents use about the salon. No invented quotes. */}
      <Reveal>
        <section className="card-pad text-center">
          <p className="eyebrow">Dog parents say it best</p>
          <h2 className="mx-auto mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Kind. Gentle. Patient.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PRAISE_WORDS.map((w) => (
              <span key={w} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                {w}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600">
            The words Huntsville dog parents use about Doggie Do&apos;s — rated 4.9 and #1 of the
            3 Best Pet Grooming in Huntsville on ThreeBestRated.
          </p>
        </section>
      </Reveal>

      {/* Visit CTA band — sunny golden yellow, their flyer colour, with warm-brown text. */}
      <Reveal>
        <section className="overflow-hidden rounded-[2rem] bg-amber-400 px-6 py-10 text-amber-950 sm:px-10 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Ready for a fresh, happy dog? Book a grooming session in minutes.
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-amber-900/75">
                {CLINIC.address}. {CLINIC.hours}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <a
                href="/book"
                className="inline-flex h-12 min-h-[52px] items-center justify-center whitespace-nowrap rounded-2xl bg-white px-5 text-[15px] font-semibold text-amber-900 transition-colors hover:bg-amber-50 sm:min-h-12"
              >
                Book a Session
              </a>
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="inline-flex h-12 min-h-[52px] items-center justify-center whitespace-nowrap rounded-2xl border-2 border-amber-900/25 px-5 text-[15px] font-semibold text-amber-900 transition-colors hover:bg-white/50 sm:min-h-12"
              >
                Call Salon
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

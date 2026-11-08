import Image from "next/image";
import { CLINIC } from "@/lib/constants";
import { ButtonLink } from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function ContactPage() {
  return (
    <div className="animate-fade-in space-y-10 pt-6 sm:pt-10">
      <Reveal>
        <header className="max-w-2xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Visit us, or just call
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
            Questions about a session, a groomer, or a booking? Call the salon — or book online and
            get confirmed on WhatsApp.
          </p>
        </header>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="h-full overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src="/images/clinic.jpg"
              alt="Doggie Do's Pet Salon and reception"
              width={1200}
              height={817}
              loading="lazy"
              className="aspect-[3/2] h-full w-full object-cover lg:aspect-auto lg:min-h-[420px]"
            />
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="card-pad flex h-full flex-col">
            <dl className="space-y-5">
              {[
                ["Address", CLINIC.address],
                ["Phone", CLINIC.phone],
                ["Email", CLINIC.email],
                ["Hours", CLINIC.hours],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0 border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-1 break-words text-[15px] font-medium leading-relaxed text-slate-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`tel:${CLINIC.phoneRaw}`} variant="accent" className="w-full sm:w-auto">
                Call Salon
              </ButtonLink>
              <ButtonLink href={CLINIC.mapsUrl} variant="outline" className="w-full sm:w-auto">
                Get directions
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-500">
              Booking online is faster — pick a groomer and a slot, and your confirmation arrives on
              WhatsApp.
            </p>
            <div className="mt-4">
              <ButtonLink href="/book" variant="primary" className="w-full sm:w-auto">
                Book a Session
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

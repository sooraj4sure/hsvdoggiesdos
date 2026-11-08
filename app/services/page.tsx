import { SERVICES } from "@/lib/services";
import { REASONS_FOR_VISIT } from "@/lib/constants";
import { ButtonLink } from "@/components/Button";
import Reveal from "@/components/Reveal";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <div className="animate-fade-in space-y-12 pt-6 sm:space-y-16 sm:pt-10">
      <Reveal>
        <header className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Happy, clean, good-looking dogs — all in one salon
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Baths, haircuts, Dremel nail trims, de-shedding and spa treatments — for dogs only.
            Fees are shown up front when you pick a slot — no surprises at the salon.
          </p>
        </header>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 90}>
            <article className="card-hover group flex h-full flex-col overflow-hidden !p-0">
              <div className="relative h-48 w-full overflow-hidden sm:h-52">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  width={1000}
                  height={667}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-card">
                  {s.fee}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
                <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-slate-600">{s.description}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{s.duration}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.reasons.map((r) => (
                    <span key={r} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      {r}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <ButtonLink href="/book" variant="outline" className="w-full">
                    Book this service
                  </ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="card-pad">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">All 15 dog services</h2>
          <p className="mt-1.5 text-[15px] text-slate-600">
            Pick any of these when you book — the right groomer is matched to your service automatically.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {REASONS_FOR_VISIT.map((r) => (
              <span key={r} className="chip !cursor-default !text-[13px]">
                {r}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

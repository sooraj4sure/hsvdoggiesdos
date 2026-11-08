import Image from "next/image";
import { CLINIC } from "@/lib/constants";
import { ButtonLink } from "@/components/Button";
import Reveal from "@/components/Reveal";

const VALUES = [
  {
    title: "Saturday grooming too",
    text: "Saturday grooming appointments are available — grooming, daycare and boarding, six days a week.",
  },
  {
    title: "One record, one salon",
    text: "Your dog's visits, services, breed and notes stay in one place, so no groomer ever starts from zero.",
  },
  {
    title: "Clear fees, always",
    text: "Fee and duration are shown before you book. No hidden charges, no surprises at the salon.",
  },
  {
    title: "Confirmed on WhatsApp",
    text: "Every booking ends with a full WhatsApp confirmation — groomer, time, slot number and directions.",
  },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in space-y-14 pt-6 sm:space-y-20 sm:pt-10">
      <Reveal>
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <p className="eyebrow">About {CLINIC.name}</p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              A family-owned dog salon, run like it should be.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {CLINIC.name} is a family-owned, dogs-only grooming salon in Huntsville, Alabama —
              in business since 2009. Ten groomers cover baths, haircuts, Dremel nail trims,
              de-shedding, puppy grooms and relaxing spa treatments — plus cage-free daycare and
              boarding in spacious dog condos. Every dog is welcome, from Goldens to doodles, and
              you&apos;re welcome to watch them groom.
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              We keep booking simple: pick a groomer, pick a slot, get confirmed on WhatsApp. Your
              dog&apos;s comfort matters as much as your time — so we built the salon around both.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book" variant="accent" className="w-full sm:w-auto">
                Book a Session
              </ButtonLink>
              <ButtonLink href="/doctors" variant="outline" className="w-full sm:w-auto">
                Meet Our Groomers
              </ButtonLink>
            </div>
          </div>
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
        </section>
      </Reveal>

      <Reveal>
        <section>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["10", "Groomers on the team"],
              ["15", "Dog services"],
              ["2009", "Family-owned since"],
              ["4.9", "ThreeBestRated score"],
            ].map(([v, l]) => (
              <div key={l} className="card-pad min-w-0 text-center">
                <dt className="text-3xl font-bold text-amber-700 sm:text-4xl">{v}</dt>
                <dd className="mt-1 text-sm text-slate-500">{l}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal>
        <section>
          <p className="eyebrow">What we stand for</p>
          <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Four things every dog parent should expect
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 90}>
                <article className="card-hover h-full">
                  <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="card-pad">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Opening hours</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{CLINIC.hours}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
            {CLINIC.address} • {CLINIC.phone} • {CLINIC.email}
          </p>
        </section>
      </Reveal>
    </div>
  );
}

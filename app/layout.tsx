import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CLINIC } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${CLINIC.name} — Pet Grooming Booking`,
  description:
    "Book a grooming session for your dog online at Doggie Do's Pet Salon in Huntsville, AL. Choose your groomer, pick a slot, get confirmed on WhatsApp.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-16 lg:px-8">{children}</main>
        <footer className="border-t border-amber-900/10 bg-amber-50 text-stone-700">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-base font-bold text-amber-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700 text-sm font-bold text-white">
                  D
                </span>
                {CLINIC.name}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-600">
                Family-owned dog grooming, daycare & boarding in Huntsville, AL — since 2009.
                Ten groomers, one simple booking system, confirmation on WhatsApp.
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-900">Explore</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/doctors" className="text-stone-600 transition-colors hover:text-amber-900">
                    Our Groomers
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-stone-600 transition-colors hover:text-amber-900">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-stone-600 transition-colors hover:text-amber-900">
                    Book a Grooming Session
                  </Link>
                </li>
                <li>
                  <Link href="/my-bookings" className="text-stone-600 transition-colors hover:text-amber-900">
                    My Bookings
                  </Link>
                </li>
              </ul>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-900">Visit us</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {CLINIC.address}
                <br />
                {CLINIC.phone}
                <br />
                {CLINIC.email}
              </p>
              <a
                className="mt-3 inline-block text-sm font-semibold text-amber-800 underline decoration-amber-400 underline-offset-4"
                href={CLINIC.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get directions →
              </a>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-900">Hours</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{CLINIC.hours}</p>
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="mt-4 inline-flex h-12 min-h-[52px] items-center justify-center rounded-2xl bg-amber-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 sm:min-h-12"
              >
                Call Salon
              </a>
            </div>
          </div>
          <p className="border-t border-amber-900/10 py-5 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} {CLINIC.name}. Family-owned since 2009. Demo preview —
            fees, groomers and availability shown are examples.
          </p>
        </footer>
      </body>
    </html>
  );
}

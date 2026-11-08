"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CLINIC } from "@/lib/constants";
import { ButtonLink } from "@/components/Button";

const LINKS = [
  { href: "/doctors", label: "Groomers" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Navbar: logo + links + Call + Login only.
 * The navbar shows a "Call" button only — never the full phone number
 * (the number lives in the hero, contact page and footer). Tapping
 * Call dials the salon. No Book a Session button here — the booking
 * CTA lives in the hero and on the booking page. This keeps the header
 * slim so it can never overflow a 360px phone.
 */
export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-700 text-base font-bold text-white">
            D
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-bold text-slate-900 sm:text-base">
              {CLINIC.name}
            </span>
            <span className="block truncate text-[11px] font-medium text-slate-500">
              Dog Salon • Huntsville, AL
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-[15px] font-medium text-slate-700 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-stone-100 ${
                pathname === l.href ? "text-amber-700" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && user.role === "patient" && (
            <Link
              href="/my-bookings"
              className={`rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-stone-100 ${
                pathname === "/my-bookings" ? "text-amber-700" : ""
              }`}
            >
              My Bookings
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-stone-100 ${
                pathname.startsWith("/admin") ? "text-amber-700" : ""
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* "Call" only — the full number is never spelled out in the navbar. */}
          <a
            href={`tel:${CLINIC.phoneRaw}`}
            className="hidden h-12 min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-stone-300 px-4 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-stone-50 md:inline-flex"
            aria-label="Call Doggie Do's Pet Salon"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call
          </a>
          {user ? (
            <>
              <span className="hidden max-w-28 truncate text-sm text-slate-600 lg:inline">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="hidden h-12 min-h-12 items-center justify-center rounded-2xl px-4 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-stone-100 sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <ButtonLink href="/login" variant="outline" className="">
              Login
            </ButtonLink>
          )}
          <button
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-300 bg-white text-slate-700 transition-colors hover:bg-stone-50 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-stone-200 bg-white px-4 pb-4 pt-2 md:hidden" aria-label="Mobile">
          <div className="flex flex-col">
            <a
              href={`tel:${CLINIC.phoneRaw}`}
              className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-amber-700 hover:bg-amber-50"
            >
              Call
            </a>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-slate-800 hover:bg-stone-100"
              >
                {l.label}
              </Link>
            ))}
            {user && user.role === "patient" && (
              <Link
                href="/my-bookings"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-slate-800 hover:bg-stone-100"
              >
                My Bookings
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-slate-800 hover:bg-stone-100"
              >
                Admin Panel
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="rounded-2xl px-3 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-stone-100"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-amber-700 hover:bg-amber-50"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

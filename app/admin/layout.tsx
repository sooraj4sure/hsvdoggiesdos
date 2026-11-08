"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/doctors", label: "Groomers" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/patients", label: "Dog Parents" },
  { href: "/admin/settings", label: "Settings" },
];

/**
 * Admin shell — same palette, typography and card language as the
 * pet-parent site. Sidebar on tablet/desktop, horizontal-scroll nav
 * on mobile (never cut off), content that wraps instead of overflowing.
 * The current section is highlighted in both navs.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex gap-6 pt-6 sm:pt-8">
      <aside className="sticky top-24 hidden h-fit w-56 shrink-0 md:block">
        <div className="rounded-3xl border border-stone-200/80 bg-white p-3 shadow-card">
          <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
            Admin Panel
          </p>
          <nav className="flex flex-col gap-0.5" aria-label="Admin">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-2xl px-3 py-3 text-[15px] transition-colors duration-200 ${
                  isActive(n.href)
                    ? "bg-mint font-bold text-amber-800"
                    : "font-medium text-slate-700 hover:bg-mint hover:text-amber-800"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-2 block rounded-2xl px-3 py-3 text-[15px] font-semibold text-amber-700 transition-colors hover:bg-amber-50"
          >
            ← View Website
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1 animate-fade-in">
        <nav className="chip-row mb-5 md:hidden" aria-label="Admin mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`chip shrink-0 text-[13px] font-semibold ${
                isActive(n.href) ? "bg-amber-700 text-white" : "bg-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}

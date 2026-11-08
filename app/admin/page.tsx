"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppointmentRow from "@/components/AppointmentRow";
import { Button } from "@/components/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState("Today");
  const [q, setQ] = useState("");
  const router = useRouter();

  async function load() {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (!me.user || me.user.role !== "admin") {
      router.push("/login?next=/admin");
      return;
    }
    // Pass the admin's LOCAL date so the stats counts match what the
    // admin sees, even if the server runs in another timezone.
    const today = new Date().toISOString().slice(0, 10);
    const s = await fetch(`/api/admin/stats?date=${today}`).then((r) => r.json());
    setStats(s);
    const params = new URLSearchParams();
    if (filter === "Today") params.set("date", today);
    if (["Pending", "Confirmed"].includes(filter)) params.set("status", filter);
    if (q) params.set("q", q);
    const a = await fetch(`/api/appointments?${params}`).then((r) => r.json());
    setList(a.appointments || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const statCards: [string, number, string][] = stats
    ? [
        ["Today total", stats.totalToday, "text-slate-900"],
        ["Pending", stats.pending, "text-amber-600"],
        ["Confirmed", stats.confirmed, "text-emerald-600"],
        ["Completed", stats.completed, "text-amber-700"],
        ["No-Show", stats.noShow, "text-slate-500"],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Doggie Do&apos;s Pet Salon — today
          </h1>
        </div>
        {stats && stats.pendingAll > 0 && (
          <span className="shrink-0 rounded-full bg-red-600 px-3.5 py-2 text-sm font-bold text-white">
            {stats.pendingAll} pending
          </span>
        )}
      </div>

      {!stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="card !p-4 sm:!p-5">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton mt-2 h-8 w-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map(([label, v, color]) => (
            <div key={label} className="card min-w-0 !p-4 sm:!p-5">
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className={`mt-1 text-3xl font-bold ${color}`}>{v}</p>
            </div>
          ))}
        </div>
      )}

      {stats?.notifications?.length > 0 && (
        <section className="card">
          <h2 className="font-bold text-slate-900">New booking alerts</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.notifications.slice(0, 5).map((n: any) => (
              <li key={n._id} className="flex gap-2 rounded-2xl bg-amber-50 px-3 py-2.5 text-slate-700">
                <span aria-hidden>🔔</span>
                <span className="min-w-0 break-words">
                  {n.message}{" "}
                  <span className="whitespace-nowrap text-slate-400">
                    ({new Date(n.createdAt).toLocaleString()})
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            V1: alerts are stored as Notification records and shown here + logged on the server. No
            real WhatsApp API is integrated.
          </p>
        </section>
      )}

      <section className="card space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter appointments">
          {["Today", "Pending", "Confirmed", "All"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <label className="label" htmlFor="dashboard-search">
              Search
            </label>
            <input
              id="dashboard-search"
              className="input"
              placeholder="Search name / phone / booking ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full sm:w-auto" variant="outline" onClick={load}>
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {!stats ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="card-pad">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton mt-3 h-4 w-full" />
              <div className="skeleton mt-2 h-4 w-2/3" />
            </div>
          ))
        ) : list.length === 0 ? (
          <div className="card text-center">
            <p className="font-bold text-slate-800">No appointments for this filter</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another filter, or check back when a new booking comes in.
            </p>
          </div>
        ) : (
          list.map((a) => <AppointmentRow key={a._id} a={a} onChange={load} />)
        )}
      </div>
    </div>
  );
}

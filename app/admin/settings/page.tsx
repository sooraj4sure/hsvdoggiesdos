"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import Reveal from "@/components/Reveal";

const CLINIC_FIELDS: { key: string; label: string; hint: string; type?: string }[] = [
  { key: "name", label: "Salon name", hint: "e.g. Doggie Do's Pet Salon" },
  { key: "address", label: "Address", hint: "Street, area, city" },
  { key: "mapsUrl", label: "Google Maps link", hint: "Link shown to dog parents with their booking" },
];

const CONTACT_FIELDS: { key: string; label: string; hint: string; type?: string }[] = [
  { key: "phone", label: "Salon phone", hint: "Shown on the website, e.g. +1 555 123 4567" },
  { key: "whatsapp", label: "WhatsApp number", hint: "Used for admin alerts in V1" },
  { key: "email", label: "Salon email", hint: "e.g. bclundberg40@gmail.com", type: "email" },
];

export default function AdminSettingsPage() {
  const [s, setS] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setS(d.settings || {});
        setLoading(false);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setMsg(res.ok ? "Settings saved — the website now uses these details." : "Could not save.");
  }

  return (
    <div className="space-y-6">
      <header className="min-w-0">
        <p className="eyebrow">Admin Panel</p>
        <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Salon Settings
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
          The salon name, address and contact details shown across the website and in booking
          messages.
        </p>
      </header>

      {loading ? (
        <div className="card-pad space-y-4">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      ) : (
        <Reveal>
          <form onSubmit={save} className="space-y-6">
            <section className="card space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Salon details</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Shown in the footer, on the About page and in booking confirmations.
                </p>
              </div>
              {CLINIC_FIELDS.map((f) => (
                <div key={f.key} className="min-w-0">
                  <label className="label" htmlFor={`settings-${f.key}`}>
                    {f.label}
                  </label>
                  <input
                    id={`settings-${f.key}`}
                    className="input"
                    type={f.type || "text"}
                    placeholder={f.hint}
                    value={s[f.key] || ""}
                    onChange={(e) => setS({ ...s, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </section>

            <section className="card space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Contact & WhatsApp</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  How dog parents reach the salon — and where admin alerts go.
                </p>
              </div>
              {CONTACT_FIELDS.map((f) => (
                <div key={f.key} className="min-w-0">
                  <label className="label" htmlFor={`settings-${f.key}`}>
                    {f.label}
                  </label>
                  <input
                    id={`settings-${f.key}`}
                    className="input"
                    type={f.type || "text"}
                    placeholder={f.hint}
                    value={s[f.key] || ""}
                    onChange={(e) => setS({ ...s, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <p className="rounded-2xl bg-mint px-4 py-3 text-sm leading-relaxed text-slate-600">
                The WhatsApp number here is used for admin alerts in V1 (stored + logged, no API
                call). The client WhatsApp message is built from the booking&apos;s own phone number.
              </p>
            </section>

            {msg && (
              <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {msg}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="w-full sm:w-auto">Save Settings</Button>
              <Link href="/admin" className="btn-outline w-full sm:w-auto">
                Back to Dashboard
              </Link>
            </div>
          </form>
        </Reveal>
      )}
    </div>
  );
}

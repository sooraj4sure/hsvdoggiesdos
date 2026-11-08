"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import Reveal from "@/components/Reveal";

const empty = { name: "", photo: "/images/doctor-1.jpg", qualification: "", specialisation: "Dog Groomer", experienceYears: 5, languages: "English", fee: 45, followUpFee: 30, slotDurationMinutes: 60, workingDays: "1,2,3,4,5,6", workingHours: "07:30-17:30", active: true };

const FIELDS: { key: string; label: string; hint: string; type?: string }[] = [
  { key: "name", label: "Full name", hint: "e.g. Lara" },
  { key: "photo", label: "Photo", hint: "File in public/images/, e.g. /images/doctor-1.jpg" },
  { key: "qualification", label: "Qualification", hint: "e.g. Lead Groomer" },
  { key: "specialisation", label: "Specialisation", hint: "e.g. Dog Groomer" },
  { key: "experienceYears", label: "Experience (years)", hint: "Years grooming", type: "number" },
  { key: "languages", label: "Languages", hint: "Comma separated, e.g. English", type: "text" },
  { key: "fee", label: "Grooming fee ($)", hint: "First visit fee", type: "number" },
  { key: "followUpFee", label: "Follow-up fee ($)", hint: "Fee for follow-up visits", type: "number" },
  { key: "slotDurationMinutes", label: "Slot duration (minutes)", hint: "30, 45 or 60", type: "number" },
  { key: "workingDays", label: "Working days", hint: "0 = Sun … 6 = Sat, e.g. 1,2,3,4,5,6" },
];

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const d = await fetch("/api/doctors").then((r) => r.json());
    setDoctors(d.doctors || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function parseHours(s: string) {
    return s
      .split(",")
      .map((p) => {
        const [start, end] = p.trim().split("-");
        return { start, end };
      })
      .filter((x) => x.start && x.end);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...form,
      languages: String(form.languages)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      workingDays: String(form.workingDays)
        .split(",")
        .map((s: string) => Number(s.trim()))
        .filter((n: number) => !isNaN(n)),
      workingHours: parseHours(form.workingHours),
    };
    const url = editing ? `/api/doctors/${editing}` : "/api/doctors";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return setMsg("Could not save groomer.");
    setMsg("Saved.");
    setForm(empty);
    setEditing("");
    load();
  }

  function edit(d: any) {
    setEditing(d._id);
    setForm({
      ...d,
      languages: (d.languages || []).join(", "),
      workingDays: (d.workingDays || []).join(","),
      workingHours: (d.workingHours || []).map((h: any) => `${h.start}-${h.end}`).join(","),
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing("");
    setForm(empty);
    setMsg("");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Groomers
          </h1>
          <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
            The groomers on the website. Add a groomer once here and their slots, fees and availability
            follow everywhere.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-3.5 py-2 text-sm font-bold text-amber-800">
          {loading ? "…" : `${doctors.length} groomers`}
        </span>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card-pad">
              <div className="skeleton h-16 w-16 !rounded-2xl" />
              <div className="skeleton mt-4 h-5 w-2/3" />
              <div className="skeleton mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="card-pad text-center">
          <p className="text-lg font-bold text-slate-900">No groomers yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
            Add your first groomer below — once saved, they appear on the website with their own
            booking slots.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {doctors.map((d, i) => (
            <Reveal key={d._id} delay={(i % 2) * 80}>
              <article className="card-hover flex h-full flex-col gap-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={d.photo}
                    alt={d.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover object-top"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="break-words font-bold text-slate-900">{d.name}</h2>
                      <span
                        className={`badge shrink-0 ${
                          d.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {d.active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {d.specialisation} • {d.qualification}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {d.experienceYears} yrs experience • {(d.languages || []).join(", ")}
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-3 gap-2 border-t border-stone-100 pt-4 text-center">
                  {[
                    [`$${d.fee}`, "Consultation"],
                    [`${d.slotDurationMinutes} min`, "Per slot"],
                    [`${(d.workingDays || []).length} days`, "A week"],
                  ].map(([v, l]) => (
                    <div key={l} className="min-w-0 rounded-2xl bg-cream px-2 py-2.5">
                      <dt className="truncate text-sm font-bold text-slate-900">{v}</dt>
                      <dd className="truncate text-[11px] text-slate-500">{l}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => edit(d)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await fetch(`/api/doctors/${d._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ active: !d.active }),
                      });
                      load();
                    }}
                  >
                    {d.active ? "Hide" : "Show"}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal>
        <form onSubmit={save} className="card space-y-5" id="doctor-form">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editing ? "Edit groomer" : "Add a groomer"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Changes appear on the website straight away. Photos are files in{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">public/images/</code> — paste
              the <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">/images/…</code> path.
              No image upload in V1.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className="min-w-0">
                <label className="label" htmlFor={`doctor-${f.key}`}>
                  {f.label}
                </label>
                <input
                  id={`doctor-${f.key}`}
                  className="input"
                  type={f.type || "text"}
                  placeholder={f.hint}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [f.key]:
                        f.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  required={["name", "photo", "qualification", "specialisation"].includes(f.key)}
                />
              </div>
            ))}
            <div className="min-w-0 sm:col-span-2">
              <label className="label" htmlFor="doctor-workingHours">
                Working hours
              </label>
              <input
                id="doctor-workingHours"
                className="input"
                placeholder="e.g. 10:00-14:00,17:00-20:00"
                value={form.workingHours}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              />
            </div>
          </div>
          {msg && (
            <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {msg}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto">{editing ? "Update Groomer" : "Add Groomer"}</Button>
            {editing && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Reveal>
    </div>
  );
}

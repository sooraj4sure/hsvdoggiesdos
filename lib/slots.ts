/**
 * Slot logic for Doggie Do's Pet Salon V1.
 *
 * Rules:
 * - A groomer works only on their workingDays, in their workingHours shifts.
 * - Slots are generated every slotDurationMinutes inside each shift.
 * - One slot = one appointment per groomer. A slot occupied by a
 *   Pending / Confirmed / Completed appointment is hidden. A Rejected
 *   appointment frees the slot instantly. A Pending appointment older
 *   than PENDING_HOLD_HOURS is treated as expired and the slot is free
 *   again (see README — Pending otherwise holds the slot until the
 *   admin confirms or rejects it).
 * - AvailabilityOverride can mark a groomer off for a whole date, or
 *   block individual slotStart values for that date.
 * - Only groomers with at least one free slot on the chosen date are
 *   shown on the booking page.
 */

export const PENDING_HOLD_HOURS = 12;

export type WorkingShift = { start: string; end: string }; // "10:00", "14:00"

export type DoctorLike = {
  _id: string;
  active: boolean;
  workingDays: number[]; // 0=Sun .. 6=Sat
  workingHours: WorkingShift[];
  slotDurationMinutes: number;
  fee: number;
  followUpFee?: number;
};

export type OverrideLike = {
  doctorId: string;
  date: string; // YYYY-MM-DD
  isOff: boolean;
  blockedSlots: string[]; // slotStart values e.g. "13:00"
};

export type AppointmentLike = {
  doctorId: string;
  date: string;
  slotStart: string;
  status: string;
  createdAt?: Date | string;
};

export function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function dateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function isPendingExpired(a: AppointmentLike) {
  if (a.status !== "Pending" || !a.createdAt) return false;
  const created = new Date(a.createdAt).getTime();
  return Date.now() - created > PENDING_HOLD_HOURS * 60 * 60 * 1000;
}

/** Is the groomer scheduled to work on this date (before overrides)? */
export function isWorkingDay(doctor: DoctorLike, date: string) {
  if (!doctor.active) return false;
  const day = new Date(date + "T12:00:00").getDay();
  return doctor.workingDays.includes(day);
}

export function generateSlots(
  doctor: DoctorLike,
  date: string,
  override: OverrideLike | null,
  appointments: AppointmentLike[],
  now = new Date()
) {
  if (!isWorkingDay(doctor, date)) return [];
  if (override?.isOff) return [];

  const blocked = new Set(override?.blockedSlots || []);
  const taken = new Set(
    appointments
      .filter((a) => ["Pending", "Confirmed", "Completed"].includes(a.status) && !isPendingExpired(a))
      .map((a) => a.slotStart)
  );

  const slots: { slotStart: string; slotEnd: string; slotNo: number }[] = [];
  let n = 1;
  for (const shift of doctor.workingHours || []) {
    let cur = toMinutes(shift.start);
    const end = toMinutes(shift.end);
    while (cur + doctor.slotDurationMinutes <= end) {
      const start = toTime(cur);
      const endT = toTime(cur + doctor.slotDurationMinutes);
      // Hide past slots for today
      const isToday = date === dateStr(now);
      const slotDateTime = new Date(`${date}T${start}:00`);
      const isPast = isToday && slotDateTime.getTime() <= now.getTime();
      if (!blocked.has(start) && !taken.has(start) && !isPast) {
        slots.push({ slotStart: start, slotEnd: endT, slotNo: n });
      }
      n++;
      cur += doctor.slotDurationMinutes;
    }
  }
  return slots;
}

/** Next free slot for a groomer, scanning the next 7 days. */
export function nextAvailable(
  doctor: DoctorLike,
  overrides: OverrideLike[],
  appointments: AppointmentLike[],
  fromDate = new Date()
) {
  for (let i = 0; i < 7; i++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + i);
    const ds = dateStr(d);
    const ov = overrides.find((o) => o.date === ds) || null;
    const dayAppts = appointments.filter((a) => a.date === ds);
    const slots = generateSlots(doctor, ds, ov, dayAppts, fromDate);
    if (slots.length > 0) {
      return { date: ds, slot: slots[0] };
    }
  }
  return null;
}

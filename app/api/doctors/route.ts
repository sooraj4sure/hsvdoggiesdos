import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { AvailabilityOverride } from "@/models/AvailabilityOverride";
import { Appointment } from "@/models/Appointment";
import { generateSlots, nextAvailable, dateStr } from "@/lib/slots";
import { requireAdmin } from "@/lib/auth";

// GET /api/doctors?date=YYYY-MM-DD
// Public: when ?date= is given, only doctors with at least one free slot
// on that date are returned (availability filtering). Without a date,
// all active doctors are returned with their next-available slot.
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || "";
  const doctors: any[] = await Doctor.find({ active: true }).sort({ name: 1 }).lean();
  const overrides: any[] = await AvailabilityOverride.find({}).lean();
  const appointments: any[] = await Appointment.find({ status: { $in: ["Pending", "Confirmed", "Completed"] } }).lean();
  const out = doctors
    .map((d: any) => {
      const doc = { ...d, _id: String(d._id) };
      const ovs = overrides.filter((o: any) => String(o.doctorId) === String(d._id));
      const appts = appointments.filter((a: any) => String(a.doctorId) === String(d._id));
      const next = nextAvailable(doc as any, ovs as any, appts as any);
      if (date) {
        const ov = ovs.find((o: any) => o.date === date) || null;
        const dayAppts = appts.filter((a: any) => a.date === date);
        const slots = generateSlots(doc as any, date, ov as any, dayAppts as any);
        if (slots.length === 0) return null; // not available that date/time — hidden
        return { ...doc, slots, nextAvailable: { date, slot: slots[0] } };
      }
      return { ...doc, nextAvailable: next };
    })
    .filter(Boolean);
  return NextResponse.json({ doctors: out });
}

// POST /api/doctors — admin only (create doctor)
export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const doc = await Doctor.create(body);
  return NextResponse.json({ doctor: doc }, { status: 201 });
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AvailabilityOverride } from "@/models/AvailabilityOverride";
import { Doctor } from "@/models/Doctor";
import { Appointment } from "@/models/Appointment";
import { generateSlots } from "@/lib/slots";
import { requireAdmin, requireAuth } from "@/lib/auth";

// GET /api/availability?doctorId=..&date=YYYY-MM-DD — free slots for that doctor/date.
// Login required (booking requires login); public slot preview is via /api/doctors?date=.
export async function GET(req: Request) {
  const user = requireAuth();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId") || "";
  const date = searchParams.get("date") || "";
  if (!doctorId || !date) return NextResponse.json({ error: "doctorId and date are required." }, { status: 400 });
  const doctor: any = await Doctor.findById(doctorId).lean();
  if (!doctor) return NextResponse.json({ error: "Groomer not found." }, { status: 404 });
  const override: any = await AvailabilityOverride.findOne({ doctorId, date }).lean();
  const appointments: any = await Appointment.find({
    doctorId, date, status: { $in: ["Pending", "Confirmed", "Completed"] },
  }).lean();
  const slots = generateSlots(doctor as any, date, override as any, appointments as any);
  return NextResponse.json({ slots, isOff: !!override?.isOff, blockedSlots: override?.blockedSlots || [] });
}

// POST /api/availability — admin only: set day off, block/unblock a slot, leave range.
export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const { doctorId, date, dates, isOff, blockedSlots, note } = await req.json();
  if (!doctorId) return NextResponse.json({ error: "doctorId is required." }, { status: 400 });
  const list: string[] = dates && Array.isArray(dates) ? dates : date ? [date] : [];
  if (list.length === 0) return NextResponse.json({ error: "date or dates are required." }, { status: 400 });
  const out = [];
  for (const d of list) {
    const ov = await AvailabilityOverride.findOneAndUpdate(
      { doctorId, date: d },
      { doctorId, date: d, isOff: !!isOff, blockedSlots: blockedSlots || [], note: note || "" },
      { upsert: true, new: true }
    );
    out.push(ov);
  }
  return NextResponse.json({ overrides: out });
}

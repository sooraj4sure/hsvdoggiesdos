import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { AvailabilityOverride } from "@/models/AvailabilityOverride";
import { Notification } from "@/models/Notification";
import { generateSlots, PENDING_HOLD_HOURS } from "@/lib/slots";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { REASONS_FOR_VISIT } from "@/lib/constants";

// GET /api/appointments — pet parent: own bookings. Admin: all, with filters/search.
export async function GET(req: Request) {
  const user = requireAuth();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const q = searchParams.get("q") || "";
  const date = searchParams.get("date") || "";
  const doctorId = searchParams.get("doctorId") || "";
  const filter: any = {};
  if (user.role !== "admin") filter.patientId = user.sub;
  if (status && status !== "All") filter.status = status;
  if (date) filter.date = date;
  if (doctorId) filter.doctorId = doctorId;
  if (q) {
    filter.$or = [
      { bookingId: new RegExp(q, "i") },
      { patientName: new RegExp(q, "i") },
      { patientPhone: new RegExp(q, "i") },
    ];
  }
  const appointments = await Appointment.find(filter)
    .sort({ date: 1, slotStart: 1 })
    .populate("doctorId", "name specialisation fee")
    .lean();
  return NextResponse.json({ appointments });
}

// POST /api/appointments — login required. Creates a Pending booking and
// locks the slot. One slot = one appointment per groomer (checked here +
// enforced by the partial unique index on the model).
export async function POST(req: Request) {
  const user = requireAuth();
  if (!user) return NextResponse.json({ error: "Login required to book." }, { status: 401 });
  await connectDB();
  const { doctorId, date, slotStart, reason, breed, notes, visitType, patientName, patientPhone } = await req.json();
  if (!doctorId || !date || !slotStart || !reason) {
    return NextResponse.json({ error: "Groomer, date, slot and service are required." }, { status: 400 });
  }
  const breedValue = typeof breed === "string" ? breed.trim().slice(0, 60) : "";
  if (!breedValue) {
    return NextResponse.json({ error: "Please select your dog's breed." }, { status: 400 });
  }
  if (!REASONS_FOR_VISIT.includes(reason)) {
    return NextResponse.json({ error: "Please pick a reason from the list." }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) return NextResponse.json({ error: "You cannot book a past date." }, { status: 400 });

  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.active) return NextResponse.json({ error: "Groomer is not available." }, { status: 400 });

  const override: any = await AvailabilityOverride.findOne({ doctorId, date }).lean();
  const existing: any = await Appointment.find({ doctorId, date, status: { $in: ["Pending", "Confirmed", "Completed"] } }).lean();
  const slots = generateSlots(doctor as any, date, override as any, existing as any);
  const slot = slots.find((s) => s.slotStart === slotStart);
  if (!slot) return NextResponse.json({ error: "That slot is no longer available. Please pick another slot." }, { status: 409 });

  // Double-check at write time (race protection; DB index is the backstop).
  const clash = await Appointment.findOne({
    doctorId, date, slotStart, status: { $in: ["Pending", "Confirmed", "Completed"] },
  });
  if (clash) return NextResponse.json({ error: "That slot was just taken. Please pick another slot." }, { status: 409 });

  const count = await Appointment.countDocuments();
  const bookingId = `APT-${101 + count}`;
  const fee = visitType === "Follow-up" && doctor.followUpFee ? doctor.followUpFee : doctor.fee;
  const pendingExpiresAt = new Date(Date.now() + PENDING_HOLD_HOURS * 60 * 60 * 1000);

  try {
    const appt = await Appointment.create({
      bookingId,
      patientId: user.sub,
      patientName: patientName || user.name,
      patientPhone: patientPhone || "",
      doctorId,
      date,
      slotStart: slot.slotStart,
      slotEnd: slot.slotEnd,
      slotNo: slot.slotNo,
      reason,
      breed: breedValue,
      notes: notes || "",
      visitType: visitType || "First Visit",
      fee,
      status: "Pending",
      pendingExpiresAt,
    });
    // Admin alert (V1: Notification record + log. No real WhatsApp API.)
    const msg = `New booking: ${appt.patientName}, ${doctor.name}, ${date} ${slot.slotStart}, Slot ${slot.slotNo}, ${bookingId}, Breed: ${breedValue}`;
    await Notification.create({ title: "New booking", message: msg, appointmentId: appt._id });
    console.log(`[Doggie Do's Pet Salon] ADMIN ALERT — ${msg}`);
    return NextResponse.json({ appointment: appt }, { status: 201 });
  } catch (e: any) {
    if (e?.code === 11000) {
      return NextResponse.json({ error: "That slot was just taken. Please pick another slot." }, { status: 409 });
    }
    throw e;
  }
}

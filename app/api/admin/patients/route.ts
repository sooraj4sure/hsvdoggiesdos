import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/patients?q=phone-or-name — past visits grouped by pet-parent phone.
export async function GET(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const filter: any = {};
  if (q) filter.$or = [{ patientPhone: new RegExp(q, "i") }, { patientName: new RegExp(q, "i") }];
  const appointments = await Appointment.find(filter)
    .sort({ date: -1 })
    .populate("doctorId", "name specialisation")
    .limit(100)
    .lean();
  return NextResponse.json({ appointments });
}

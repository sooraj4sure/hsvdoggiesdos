import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Notification } from "@/models/Notification";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/stats — dashboard counts + today's appointments + alerts.
export async function GET(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const today = new Date().toISOString().slice(0, 10);
  const [totalToday, pending, confirmed, completed, noShow, pendingAll] = await Promise.all([
    Appointment.countDocuments({ date: today }),
    Appointment.countDocuments({ date: today, status: "Pending" }),
    Appointment.countDocuments({ date: today, status: "Confirmed" }),
    Appointment.countDocuments({ date: today, status: "Completed" }),
    Appointment.countDocuments({ date: today, status: "No-Show" }),
    Appointment.countDocuments({ status: "Pending" }),
  ]);
  const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json({
    today, totalToday, pending, confirmed, completed, noShow, pendingAll, notifications,
  });
}

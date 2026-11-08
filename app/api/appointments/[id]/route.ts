import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { requireAdmin } from "@/lib/auth";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";

// PATCH /api/appointments/[id] — admin only: Confirm / Reject / Completed / No-Show.
// After Confirm/Reject the response includes the WhatsApp message + wa.me link
// (the Send Msg to Client button). Before that, the button stays disabled in UI.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const { status } = await req.json();
  if (!["Confirmed", "Rejected", "Completed", "No-Show"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const appt = await Appointment.findByIdAndUpdate(params.id, { status }, { new: true }).populate("doctorId");
  if (!appt) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  const doctor: any = appt.doctorId;
  let whatsappMessage = "";
  let whatsappLink = "";
  if (status === "Confirmed" || status === "Rejected") {
    whatsappMessage = buildWhatsAppMessage({
      patientName: appt.patientName,
      doctorName: doctor?.name || "Groomer",
      date: appt.date,
      slotStart: appt.slotStart,
      slotEnd: appt.slotEnd,
      slotNo: appt.slotNo,
      bookingId: appt.bookingId,
      reason: appt.reason,
      breed: appt.breed || "",
      fee: appt.fee,
      status,
    });
    whatsappLink = buildWhatsAppLink(appt.patientPhone, whatsappMessage);
  }
  return NextResponse.json({ appointment: appt, whatsappMessage, whatsappLink });
}

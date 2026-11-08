import { jsPDF } from "jspdf";
import { formatTime12 } from "./slots";
import { CLINIC } from "./constants";

/**
 * Build and download a clean, professional A4 (210 x 297 mm) invoice PDF
 * for a Completed appointment. One service line, total = fee, no tax lines.
 * Uses the app's light ivory / gold / brown palette.
 */

export type InvoiceAppointment = {
  patientName: string;
  patientPhone: string;
  doctorId?: { name?: string } | string;
  date: string; // YYYY-MM-DD
  slotStart: string; // "HH:MM"
  slotEnd: string; // "HH:MM"
  slotNo: number;
  bookingId: string;
  reason: string;
  breed?: string;
  fee: number;
  status: string;
};

function formatLongDate(dateStr: string): string {
  // Parse at noon to avoid UTC-day shifts for a plain YYYY-MM-DD date.
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function money(n: number): string {
  return `$${Number(n || 0).toFixed(2)}`;
}

export function downloadInvoice(a: InvoiceAppointment) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;

  // Palette — matches the app: warm ivory background, gold accent, rich browns.
  const brown: [number, number, number] = [124, 45, 18]; // deep warm brown
  const darkBrown: [number, number, number] = [68, 38, 20];
  const gold: [number, number, number] = [180, 83, 9]; // antique gold
  const lightGold: [number, number, number] = [253, 246, 236]; // ivory
  const grey: [number, number, number] = [100, 100, 100];
  const lineGrey: [number, number, number] = [225, 215, 200];

  // ---- Header band (ivory) ----
  doc.setFillColor(...lightGold);
  doc.rect(0, 0, pageW, 52, "F");
  // Gold rule under the header band
  doc.setFillColor(...gold);
  doc.rect(0, 52, pageW, 1.2, "F");

  // Salon name + tagline
  doc.setTextColor(...brown);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(CLINIC.name, margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...grey);
  doc.text("Dog Salon \u2022 Huntsville, AL \u2022 Family-owned since 2009", margin, 26);

  // Salon contact (right side of header)
  doc.setFontSize(9);
  doc.setTextColor(...darkBrown);
  const contact = [CLINIC.address, `Phone: ${CLINIC.phone}`, `Email: ${CLINIC.email}`];
  contact.forEach((line, i) => {
    doc.text(line, pageW - margin, 15 + i * 5, { align: "right" });
  });

  // ---- Invoice title block ----
  let y = 68;
  doc.setTextColor(...brown);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...darkBrown);
  const invoiceNo = `INV-${a.bookingId}`;
  const invoiceDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Invoice No: ${invoiceNo}`, pageW - margin, y - 6, { align: "right" });
  doc.text(`Invoice Date: ${invoiceDate}`, pageW - margin, y, { align: "right" });

  // ---- Billed to + appointment details ----
  y += 14;
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentW, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text("BILLED TO", margin, y);
  doc.text("APPOINTMENT", margin + 95, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...darkBrown);
  doc.text(a.patientName, margin, y);
  doc.setFontSize(10);
  doc.setTextColor(...grey);
  doc.text(`Phone: ${a.patientPhone}`, margin, y + 6);

  const groomerName = typeof a.doctorId === "string" ? a.doctorId : a.doctorId?.name || "Groomer";
  const details: [string, string][] = [
    ["Groomer", groomerName],
    ["Service", a.reason],
    ...(a.breed ? [["Breed", a.breed] as [string, string]] : []),
    ["Date", formatLongDate(a.date)],
    ["Time", `${formatTime12(a.slotStart)} - ${formatTime12(a.slotEnd)}`],
    ["Slot No.", String(a.slotNo)],
    ["Booking ID", a.bookingId],
  ];
  let dy = y;
  doc.setFontSize(10);
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkBrown);
    doc.text(`${label}:`, margin + 95, dy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grey);
    doc.text(value, margin + 95 + 24, dy);
    dy += 6;
  });

  // ---- Itemised table ----
  y = Math.max(y + 16, dy + 8);
  // Table header
  doc.setFillColor(...brown);
  doc.rect(margin, y, contentW, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", margin + 3, y + 6);
  doc.text("Amount", margin + contentW - 3, y + 6, { align: "right" });

  // Table row — one service line
  y += 9;
  const desc = `${a.reason} \u2014 ${groomerName}${a.breed ? ` (${a.breed})` : ""}`;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentW, 11, "F");
  doc.setTextColor(...darkBrown);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(desc, margin + 3, y + 7);
  doc.text(money(a.fee), margin + contentW - 3, y + 7, { align: "right" });
  y += 11;
  doc.setDrawColor(...lineGrey);
  doc.line(margin, y, margin + contentW, y);

  // Total row
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...brown);
  doc.text("Total", margin + contentW - 45, y);
  doc.text(money(a.fee), margin + contentW - 3, y, { align: "right" });
  y += 4;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(margin + contentW - 48, y, margin + contentW, y);

  // ---- Footer ----
  const footerY = 272;
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, margin + contentW, footerY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...brown);
  doc.text("Thank you for trusting Doggie Do's Pet Salon with your dog!", pageW / 2, footerY + 9, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...grey);
  doc.text(
    `${CLINIC.address}  \u2022  ${CLINIC.phone}  \u2022  ${CLINIC.email}`,
    pageW / 2,
    footerY + 15,
    { align: "center" },
  );

  doc.save(`Invoice-${a.bookingId}.pdf`);
}

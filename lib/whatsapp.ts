import { CLINIC } from "./constants";

/**
 * Build the WhatsApp message sent to the client after Confirm/Reject.
 * V1 uses a wa.me link (no WhatsApp Business API). Admin taps Send in WhatsApp.
 */
export function buildWhatsAppMessage(a: {
  patientName: string;
  doctorName: string;
  date: string;
  slotStart: string;
  slotEnd: string;
  slotNo: number;
  bookingId: string;
  reason: string;
  breed?: string;
  fee: number;
  status: "Confirmed" | "Rejected";
  nextFreeSlot?: string;
}) {
  const time = `${a.slotStart} - ${a.slotEnd}`;
  const breedLine = a.breed ? `Breed: ${a.breed}\n` : "";
  if (a.status === "Confirmed") {
    return (
      `Hello ${a.patientName},\n` +
      `Your grooming appointment at ${CLINIC.name} is Confirmed.\n\n` +
      `Groomer: ${a.doctorName}\n` +
      `Date: ${a.date}\n` +
      `Time: ${time}\n` +
      `Slot No.: ${a.slotNo}\n` +
      `Booking ID: ${a.bookingId}\n` +
      `Reason: ${a.reason}\n` +
      breedLine +
      `Grooming Fee: $${a.fee}\n\n` +
      `Please arrive 10 mins early.\n` +
      `Address: ${CLINIC.address}\n` +
      `Google Maps: ${CLINIC.mapsUrl}\n` +
      `Call us: ${CLINIC.phone}`
    );
  }
  return (
    `Hello ${a.patientName},\n` +
    `Your grooming appointment request at ${CLINIC.name} could not be confirmed for ${a.date} at ${time} with ${a.doctorName} (Booking ID: ${a.bookingId}, Reason: ${a.reason}${a.breed ? `, Breed: ${a.breed}` : ""}).\n\n` +
    (a.nextFreeSlot ? `Next free slot: ${a.nextFreeSlot}. Reply YES if you would like us to book it for you.\n\n` : "") +
    `Please call us at ${CLINIC.phone} to pick another time.\n` +
    `Address: ${CLINIC.address}`
  );
}

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

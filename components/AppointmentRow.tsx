"use client";
import { useState } from "react";
import { formatTime12 } from "@/lib/slots";
import { Button } from "@/components/Button";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { downloadInvoice } from "@/lib/invoice";

const badge: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Completed: "bg-amber-100 text-amber-800",
  "No-Show": "bg-stone-200 text-stone-700",
};

/** One appointment card: Confirm/Reject, then Send Msg to Client (enabled only after a decision), Copy, Completed/No-Show. All buttons go through the single Button component, so they are identical in size. */
export default function AppointmentRow({ a, onChange }: { a: any; onChange: () => void }) {
  const [wa, setWa] = useState<{ message: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function setStatus(status: string) {
    const res = await fetch(`/api/appointments/${a._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.whatsappMessage) setWa({ message: data.whatsappMessage, link: data.whatsappLink });
    onChange();
  }

  // A Completed appointment was necessarily Confirmed first, so the WhatsApp
  // button stays usable after completion (it used to lock itself again because
  // the in-memory message was lost when the list refreshed).
  const canSend =
    a.status === "Confirmed" || a.status === "Rejected" || a.status === "Completed" || !!wa;

  // FIX: the WhatsApp message/link used to exist only in the Confirm/Reject
  // response, so after a page reload the button looked enabled but did nothing
  // for appointments that were already Confirmed/Rejected. Rebuild it from the
  // appointment itself whenever one is decided, so the button always works.
  const decided =
    a.status === "Confirmed" || a.status === "Rejected" || a.status === "Completed";
  const fallbackMessage = decided
    ? buildWhatsAppMessage({
        patientName: a.patientName,
        doctorName: a.doctorId?.name || "Groomer",
        date: a.date,
        slotStart: a.slotStart,
        slotEnd: a.slotEnd,
        slotNo: a.slotNo,
        bookingId: a.bookingId,
        reason: a.reason,
        breed: a.breed || "",
        fee: a.fee,
        // Completed implies it was Confirmed — send the confirmation wording.
        status: (a.status === "Completed" ? "Confirmed" : a.status) as "Confirmed" | "Rejected",
      })
    : "";
  const waMessage = wa?.message || fallbackMessage;
  const waLink = wa?.link || (fallbackMessage ? buildWhatsAppLink(a.patientPhone, fallbackMessage) : "");

  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words font-bold text-slate-900">
            {a.patientName} • {a.doctorId?.name || a.doctorId}
          </p>
          <p className="mt-0.5 break-words text-sm text-slate-600">
            {a.date} • {formatTime12(a.slotStart)} - {formatTime12(a.slotEnd)} • Slot No. {a.slotNo} •{" "}
            {a.bookingId}
          </p>
          <p className="mt-0.5 break-words text-sm text-slate-500">
            Reason: {a.reason}{a.breed ? ` • Breed: ${a.breed}` : ""} • {a.visitType} • Fee: ${a.fee} • WhatsApp: {a.patientPhone}
          </p>
          {a.notes && <p className="mt-0.5 break-words text-sm text-slate-500">Notes: {a.notes}</p>}
        </div>
        <span className={`badge shrink-0 ${badge[a.status] || ""}`}>{a.status}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {a.status === "Pending" && (
          <>
            <Button onClick={() => setStatus("Confirmed")}>Confirm</Button>
            <Button variant="outline" onClick={() => setStatus("Rejected")}>
              Reject
            </Button>
          </>
        )}
        {(a.status === "Confirmed" || a.status === "Rejected") && (
          <>
            <Button onClick={() => setStatus("Completed")}>Mark Completed</Button>
            <Button variant="outline" onClick={() => setStatus("No-Show")}>
              Mark No-Show
            </Button>
          </>
        )}
        <Button
          variant="accent"
          disabled={!canSend}
          title={canSend ? "Open WhatsApp with the full message" : "Confirm or Reject first — then this button turns on"}
          onClick={() => {
            if (waLink) window.open(waLink, "_blank");
          }}
        >
          Send Msg to Client
        </Button>
        <Button
          variant="outline"
          disabled={!canSend || !waMessage}
          onClick={async () => {
            if (waMessage) {
              await navigator.clipboard.writeText(waMessage);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
        >
          {copied ? "Copied!" : "Copy Message"}
        </Button>
        {a.status === "Completed" && (
          <Button variant="accent" onClick={() => downloadInvoice(a)}>
            Download Invoice
          </Button>
        )}
      </div>
      {waMessage && (
        <pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-slate-700">
          {waMessage}
        </pre>
      )}
      {!canSend && (
        <p className="mt-3 text-xs text-slate-400">Send Msg to Client unlocks after Confirm or Reject.</p>
      )}
    </article>
  );
}

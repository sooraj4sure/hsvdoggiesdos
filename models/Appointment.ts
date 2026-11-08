import mongoose, { Schema, models, model } from "mongoose";

export const APPOINTMENT_STATUSES = ["Pending", "Confirmed", "Rejected", "Completed", "No-Show"] as const;

const AppointmentSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true }, // e.g. APT-101
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true }, // WhatsApp number used at booking
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    slotStart: { type: String, required: true }, // "16:00"
    slotEnd: { type: String, required: true },
    slotNo: { type: Number, required: true },
    reason: { type: String, required: true }, // one of the 15 reasons for visit
    breed: { type: String, default: "" }, // dog breed picked at booking ("Other" stores the typed breed)
    notes: { type: String, default: "" },
    visitType: { type: String, enum: ["First Visit", "Follow-up"], default: "First Visit" },
    fee: { type: Number, required: true },
    status: { type: String, enum: APPOINTMENT_STATUSES, default: "Pending" },
    // Pending lock expiry: a Pending booking holds its slot for 12h.
    // After that it is treated as expired and the slot is free again (see lib/slots.ts).
    pendingExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// One slot = one appointment per groomer. Rejected bookings do NOT block
// the slot, so the unique index only applies to live statuses.
AppointmentSchema.index(
  { doctorId: 1, date: 1, slotStart: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["Pending", "Confirmed", "Completed"] } } }
);
AppointmentSchema.index({ patientId: 1, createdAt: -1 });
AppointmentSchema.index({ date: 1, doctorId: 1 });

export const Appointment = (models.Appointment || model("Appointment", AppointmentSchema)) as mongoose.Model<any>;

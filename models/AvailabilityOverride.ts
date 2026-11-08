import mongoose, { Schema, models, model } from "mongoose";

// Per-doctor, per-date override: whole day off, or individual slots blocked.
const AvailabilityOverrideSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    isOff: { type: Boolean, default: false },
    blockedSlots: { type: [String], default: [] }, // slotStart values e.g. "13:00"
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

AvailabilityOverrideSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export const AvailabilityOverride = (models.AvailabilityOverride || model("AvailabilityOverride", AvailabilityOverrideSchema)) as mongoose.Model<any>;

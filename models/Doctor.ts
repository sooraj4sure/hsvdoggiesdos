import mongoose, { Schema, models, model } from "mongoose";

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, required: true }, // path in public/images/, e.g. /images/doctor-1.svg — no external storage
    qualification: { type: String, required: true },
    specialisation: { type: String, required: true },
    experienceYears: { type: Number, default: 0 },
    languages: { type: [String], default: ["English"] },
    fee: { type: Number, required: true }, // first-visit consultation fee in $
    followUpFee: { type: Number, default: 0 },
    slotDurationMinutes: { type: Number, required: true, default: 15 },
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5, 6] }, // 0=Sun..6=Sat; Sunday closed by default
    workingHours: {
      type: [{ start: { type: String, required: true }, end: { type: String, required: true } }],
      default: [{ start: "10:00", end: "14:00" }, { start: "17:00", end: "20:00" }],
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Doctor = (models.Doctor || model("Doctor", DoctorSchema)) as mongoose.Model<any>;

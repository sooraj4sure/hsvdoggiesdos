import mongoose, { Schema, models, model } from "mongoose";

const ClinicSettingsSchema = new Schema(
  {
    name: { type: String, default: "Doggie Do's Pet Salon" },
    address: { type: String, default: "3409 Governors Dr SW, Huntsville, AL 35805" },
    phone: { type: String, default: "+1 (256) 533-3383" },
    whatsapp: { type: String, default: "+12565333383" },
    email: { type: String, default: "bclundberg40@gmail.com" },
    mapsUrl: { type: String, default: "https://maps.google.com/?q=3409+Governors+Dr+SW+Huntsville+AL+35805" },
    closedDays: { type: [Number], default: [0] }, // Sunday closed
  },
  { timestamps: true }
);

export const ClinicSettings = (models.ClinicSettings || model("ClinicSettings", ClinicSettingsSchema)) as mongoose.Model<any>;

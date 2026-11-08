import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }, // WhatsApp number, with country code
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
  },
  { timestamps: true }
);

export const User = (models.User || model("User", UserSchema)) as mongoose.Model<any>;

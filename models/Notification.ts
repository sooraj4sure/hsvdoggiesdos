import mongoose, { Schema, models, model } from "mongoose";

// Admin alert: created whenever a new booking comes in (V1: shown in the
// admin dashboard + logged. No real WhatsApp API is integrated in V1).
const NotificationSchema = new Schema(
  {
    type: { type: String, default: "new_booking" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = (models.Notification || model("Notification", NotificationSchema)) as mongoose.Model<any>;

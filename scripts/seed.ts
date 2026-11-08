import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import { User } from "../models/User";
import { Doctor } from "../models/Doctor";
import { Appointment } from "../models/Appointment";
import { Notification } from "../models/Notification";
import { ClinicSettings } from "../models/ClinicSettings";
import { AvailabilityOverride } from "../models/AvailabilityOverride";
import { CLINIC } from "../lib/constants";

// Doggie Do's Pet Salon — demo groomers.
// Lara and Diana are the salon's real sister groomers (Lara is the most-praised
// by reviewers); Bernie is the owner. The other seven are clearly demo
// groomers with first names only — no invented surnames or credentials.
const DOCTORS = [
  { name: "Lara", photo: "/images/doctor-1.jpg", qualification: "Lead Groomer — dogs of every size and coat", specialisation: "Dog Groomer", experienceYears: 16, languages: ["English"], fee: 45, followUpFee: 30, slotDurationMinutes: 60, workingDays: [1, 2, 3, 4, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Diana", photo: "/images/doctor-2.jpg", qualification: "Nail care specialist — gentle Dremel trims", specialisation: "Nail & Paw Care", experienceYears: 16, languages: ["English"], fee: 25, followUpFee: 15, slotDurationMinutes: 30, workingDays: [1, 2, 3, 4, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Bernie", photo: "/images/doctor-3.jpg", qualification: "Owner — family-owned since 2009", specialisation: "Owner & Groomer", experienceYears: 16, languages: ["English"], fee: 50, followUpFee: 35, slotDurationMinutes: 60, workingDays: [1, 2, 3, 4, 5], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Maya", photo: "/images/doctor-4.jpg", qualification: "Puppy grooming specialist", specialisation: "Puppy Specialist", experienceYears: 8, languages: ["English"], fee: 35, followUpFee: 25, slotDurationMinutes: 45, workingDays: [1, 3, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Liam", photo: "/images/doctor-5.jpg", qualification: "De-shedding specialist", specialisation: "De-shedding Specialist", experienceYears: 9, languages: ["English"], fee: 55, followUpFee: 35, slotDurationMinutes: 60, workingDays: [2, 4, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Sofia", photo: "/images/doctor-6.jpg", qualification: "Spa & bath specialist", specialisation: "Spa & Bath Specialist", experienceYears: 10, languages: ["English"], fee: 45, followUpFee: 30, slotDurationMinutes: 45, workingDays: [1, 2, 3, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Ethan", photo: "/images/doctor-7.jpg", qualification: "Senior dog care groomer", specialisation: "Senior Dog Care", experienceYears: 14, languages: ["English"], fee: 50, followUpFee: 35, slotDurationMinutes: 60, workingDays: [1, 3, 5], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Ava", photo: "/images/doctor-8.jpg", qualification: "Daycare & boarding lead", specialisation: "Daycare & Boarding", experienceYears: 7, languages: ["English"], fee: 40, followUpFee: 25, slotDurationMinutes: 60, workingDays: [1, 2, 3, 4, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Noah", photo: "/images/doctor-9.jpg", qualification: "Large breed specialist", specialisation: "Large Breed Specialist", experienceYears: 11, languages: ["English"], fee: 60, followUpFee: 40, slotDurationMinutes: 60, workingDays: [1, 2, 4, 5, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
  { name: "Olivia", photo: "/images/doctor-10.jpg", qualification: "Breed cut & styling specialist", specialisation: "Breed Cut & Styling", experienceYears: 6, languages: ["English"], fee: 55, followUpFee: 35, slotDurationMinutes: 60, workingDays: [2, 4, 6], workingHours: [{ start: "07:30", end: "17:30" }], active: true },
];

function dayOffset(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

async function main() {
  await connectDB();
  console.log("Seeding Doggie Do's Pet Salon…");
  await Promise.all([
    User.deleteMany({}), Doctor.deleteMany({}), Appointment.deleteMany({}),
    Notification.deleteMany({}), ClinicSettings.deleteMany({}), AvailabilityOverride.deleteMany({}),
  ]);

  await ClinicSettings.create({ name: CLINIC.name, address: CLINIC.address, phone: CLINIC.phone, whatsapp: CLINIC.whatsappRaw, email: CLINIC.email, mapsUrl: CLINIC.mapsUrl, closedDays: [0] });

  const adminHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "Admin123!", 10);
  const patientHash = await bcrypt.hash(process.env.SEED_PATIENT_PASSWORD || "Patient123!", 10);
  const admin = await User.create({ name: "Salon Admin", phone: "+12565333383", email: "admin@doggiedos.example", passwordHash: adminHash, role: "admin" });
  const patient = await User.create({ name: "Alex Demo", phone: "+12565550011", email: "patient@demo.example", passwordHash: patientHash, role: "patient" });
  const patient2 = await User.create({ name: "Jamie Demo", phone: "+12565550022", email: "jamie@demo.example", passwordHash: patientHash, role: "patient" });

  const doctors = await Doctor.insertMany(DOCTORS);
  const bySpec = (s: string) => doctors.find((d: any) => d.specialisation === s)!;

  // Exercise availability filtering: Senior Dog Care groomer is off tomorrow (leave),
  // De-shedding Specialist has one slot blocked tomorrow.
  const tomorrow = dayOffset(1);
  await AvailabilityOverride.create({ doctorId: bySpec("Senior Dog Care")._id, date: tomorrow, isOff: true, note: "On leave" });
  await AvailabilityOverride.create({ doctorId: bySpec("De-shedding Specialist")._id, date: tomorrow, isOff: false, blockedSlots: ["11:00"], note: "Lunch / break" });

  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const seeded = [
    { bookingId: "APT-101", patientId: patient._id, patientName: "Alex Demo", patientPhone: "+12565550011", doctorId: bySpec("Dog Groomer")._id, date: tomorrow, slotStart: "10:00", slotEnd: "11:00", slotNo: 2, reason: "Full Groom", breed: "Golden Retriever", visitType: "First Visit", fee: 45, status: "Pending", pendingExpiresAt: expires },
    { bookingId: "APT-102", patientId: patient2._id, patientName: "Jamie Demo", patientPhone: "+12565550022", doctorId: bySpec("Nail & Paw Care")._id, date: tomorrow, slotStart: "09:00", slotEnd: "09:30", slotNo: 1, reason: "Nail Trim", breed: "Doodle", visitType: "First Visit", fee: 25, status: "Confirmed", pendingExpiresAt: expires },
    { bookingId: "APT-103", patientId: patient._id, patientName: "Alex Demo", patientPhone: "+12565550011", doctorId: bySpec("Dog Groomer")._id, date: dayOffset(-1), slotStart: "10:00", slotEnd: "11:00", slotNo: 2, reason: "Bath & Blow Dry", breed: "Golden Retriever", visitType: "First Visit", fee: 45, status: "Completed", pendingExpiresAt: expires },
  ];
  const appts = await Appointment.insertMany(seeded);
  await Notification.create({ title: "New booking", message: `New booking: Alex Demo, ${bySpec("Dog Groomer").name}, ${tomorrow} 10:00, Slot 2, APT-101, Breed: Golden Retriever`, appointmentId: appts[0]._id });

  console.log("Seeded:");
  console.log("  Salon: Doggie Do's Pet Salon — 10 groomers, 3 demo appointments (1 Pending, 1 Confirmed, 1 Completed)");
  console.log("  Admin: admin@doggiedos.example / Admin123! (override with SEED_ADMIN_PASSWORD)");
  console.log("  Patient: patient@demo.example / Patient123! (override with SEED_PATIENT_PASSWORD)");
  console.log("  Senior Dog Care groomer is OFF tomorrow, De-shedding Specialist 11:00 slot blocked tomorrow — try booking for tomorrow to see filtering.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

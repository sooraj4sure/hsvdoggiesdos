import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ClinicSettings } from "@/models/ClinicSettings";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await connectDB();
  let s: any = await ClinicSettings.findOne().lean();
  if (!s) s = await ClinicSettings.create({});
  return NextResponse.json({ settings: s });
}

export async function PATCH(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const s = await ClinicSettings.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json({ settings: s });
}

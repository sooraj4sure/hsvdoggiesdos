import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const doc = await Doctor.findByIdAndUpdate(params.id, body, { new: true });
  if (!doc) return NextResponse.json({ error: "Groomer not found." }, { status: 404 });
  return NextResponse.json({ doctor: doc });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  await connectDB();
  // Soft-hide rather than delete, so past appointments keep their doctor.
  await Doctor.findByIdAndUpdate(params.id, { active: false });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const { name, phone, email, password } = await req.json();
  if (!name || !phone || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, phone, email: email.toLowerCase(), passwordHash, role: "patient" });
  const token = signToken({ sub: String(user._id), role: "patient", name: user.name, email: user.email });
  const res = NextResponse.json({ ok: true, user: { id: user._id, name: user.name, role: "patient" } });
  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
  return res;
}

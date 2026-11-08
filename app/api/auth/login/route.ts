import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const token = signToken({ sub: String(user._id), role: user.role, name: user.name, email: user.email });
  const res = NextResponse.json({ ok: true, user: { id: user._id, name: user.name, role: user.role } });
  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
  return res;
}

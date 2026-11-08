import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = getAuthUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}

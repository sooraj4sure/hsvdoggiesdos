import { NextResponse } from "next/server";
import { REASONS_FOR_VISIT } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({ reasons: REASONS_FOR_VISIT });
}

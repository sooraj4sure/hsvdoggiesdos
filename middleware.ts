import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Booking requires login. Admin pages require a login too (role is
// enforced again in the API routes and in the admin layout/page).
// Middleware checks only for the presence of the httpOnly token cookie;
// full JWT verification + role check happen server-side in lib/auth.ts.
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const protectedPaths = ["/book", "/my-bookings", "/admin"];
  if (protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/book/:path*", "/my-bookings/:path*", "/admin/:path*"] };

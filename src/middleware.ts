import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes (but not login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload) {
      // Redirect to admin login if token is invalid
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Add user info to headers for use in admin pages
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    response.headers.set("x-user-email", payload.email);
    response.headers.set("x-user-role", payload.role);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

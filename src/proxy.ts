import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function proxy(request: NextRequest) {
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
    if (!payload || payload.role !== "admin") {
      // Redirect to admin login if token is invalid
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Add user info to headers for use in admin pages
    const response = NextResponse.next();
    response.headers.set("x-user-id", String(payload.id));
    response.headers.set("x-user-email", String(payload.email));
    response.headers.set("x-user-role", String(payload.role));

    return response;
  }

  // Check if the request is for corporate mobility routes
  if (pathname.startsWith("/corporate-mobility")) {
    // Handle login page - redirect to account if already authenticated
    if (pathname === "/corporate-mobility/login") {
      const token = request.cookies.get("corporate-auth-token")?.value;

      if (token) {
        const payload = await verifyToken(token);

        if (payload && payload.role === "corporate") {
          // User is authenticated, redirect to account
          return NextResponse.redirect(
            new URL("/corporate-mobility/account", request.url)
          );
        }
      }

      return NextResponse.next();
    }

    // Allow public access to register page and other non-account pages
    if (!pathname.includes("/account")) {
      return NextResponse.next();
    }

    // Protect only routes containing /account
    const token = request.cookies.get("corporate-auth-token")?.value;

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(
        new URL("/corporate-mobility/login", request.url)
      );
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "corporate") {
      // Invalid or expired token, redirect to login
      return NextResponse.redirect(
        new URL("/corporate-mobility/login", request.url)
      );
    }

    // Add user info to headers for use in corporate pages
    const response = NextResponse.next();
    response.headers.set("x-user-id", String(payload.id));
    response.headers.set("x-user-email", String(payload.email));
    response.headers.set("x-user-role", String(payload.role));
    response.headers.set(
      "x-corporate-reference",
      String(payload.corporate_reference || "")
    );
    response.headers.set("x-company-name", String(payload.company_name || ""));

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/corporate-mobility/:path*"],
};

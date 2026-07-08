import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to decode JWT payload safely in Next.js Edge Runtime
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is NOT logged in
  if (!token) {
    // Only allow access to "/" (landing page) and "/login" (login page)
    if (pathname !== "/" && pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. If user IS logged in
  const payload = decodeJwt(token);
  const role = payload?.role; // OWNER | ADMIN | TEACHER | STUDENT

  // If token is invalid or has no role, clear token and redirect to login
  if (!role || role === "ADMIN") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  // If logged in and trying to access login page, redirect to their dashboard
  if (pathname === "/login") {
    return redirectRoleDashboard(role, request.url);
  }

  // Handle dashboard paths protection based on roles
  if (pathname.startsWith("/dashboard")) {
    // If accessing "/dashboard" itself, redirect to their role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return redirectRoleDashboard(role, request.url);
    }

    // Protect "/dashboard/center-owner" -> only OWNER and ADMIN allowed
    if (pathname.startsWith("/dashboard/center-owner") && role !== "OWNER") {
      return redirectRoleDashboard(role, request.url);
    }

    // Protect "/dashboard/instructor" -> only TEACHER allowed
    if (pathname.startsWith("/dashboard/instructor") && role !== "TEACHER") {
      return redirectRoleDashboard(role, request.url);
    }

    // Protect "/dashboard/student" -> only STUDENT allowed
    if (pathname.startsWith("/dashboard/student") && role !== "STUDENT") {
      return redirectRoleDashboard(role, request.url);
    }
  }

  return NextResponse.next();
}

// Redirects the user to their role-specific dashboard URL
function redirectRoleDashboard(role: string, requestUrl: string) {
  let targetPath = "/login";

  if (role === "OWNER") {
    targetPath = "/dashboard/center-owner";
  } else if (role === "TEACHER") {
    targetPath = "/dashboard/instructor";
  } else if (role === "STUDENT") {
    targetPath = "/dashboard/student";
  }

  return NextResponse.redirect(new URL(targetPath, requestUrl));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes and server actions)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

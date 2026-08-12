import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

// Helper function to decode JWT payload safely in Next.js Edge Runtime
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
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

  // Allow static assets, images, and metadata files without redirection
  if (
    pathname.startsWith("/images") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 1. If user is NOT logged in
  if (!token) {
    // Only allow access to "/" (landing page) and "/login" (login page)
    if (pathname !== "/" && pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Decode JWT and check expiration & role
  const payload = decodeJwt(token);
  const isExpired = !!payload?.exp && payload.exp * 1000 < Date.now();
  const role = payload?.role; // OWNER | TEACHER | STUDENT

  // If token is invalid, expired, or has no valid role, clear token
  if (!payload || isExpired || !role || role === "ADMIN") {
    // If accessing protected routes, redirect to login with token cleared
    if (pathname !== "/" && pathname !== "/login") {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // If accessing public pages ("/" or "/login"), proceed as guest and strip stale token
    const requestHeaders = new Headers(request.headers);
    const cookieHeader = request.headers.get("cookie") || "";
    const updatedCookieHeader = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter((c) => !c.startsWith("token="))
      .join("; ");

    if (updatedCookieHeader) {
      requestHeaders.set("cookie", updatedCookieHeader);
    } else {
      requestHeaders.delete("cookie");
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.delete("token");
    return response;
  }

  // 3. If logged in with a valid token and trying to access login page, redirect to their dashboard
  if (pathname === "/login") {
    return redirectRoleDashboard(role, request.url);
  }

  // 4. Handle dashboard paths protection based on roles
  if (pathname.startsWith("/dashboard")) {
    // If accessing "/dashboard" itself, redirect to their role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return redirectRoleDashboard(role, request.url);
    }

    // Protect "/dashboard/center-owner" -> only OWNER allowed
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
     * - images, public files, metadata files
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

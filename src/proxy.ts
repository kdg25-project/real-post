import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get locale from cookie
  const locale = request.cookies.get("lang")?.value || "en";
  
  // Clone the request headers and add the locale
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  if (pathname.startsWith("/admin/auth") || pathname.startsWith("/user/auth") || pathname.startsWith("/user/home")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.redirect(new URL("/user/auth/login", request.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(new URL("/user/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/user',
    '/user/:path*',
    '/survey/:path*',
  ]
};
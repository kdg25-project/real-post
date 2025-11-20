import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/auth") || pathname.startsWith("/user/auth")) {
    return NextResponse.next();
  }
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.redirect(new URL("/user/auth/login", request.url));
    }

    return NextResponse.next();
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
  ]
};
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/auth") || pathname.startsWith("/user/auth")) {
    return NextResponse.next();
  }
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return NextResponse.redirect(new URL("/user/auth/login", request.url));
  }

  if (!(session.user.accountType == "company") && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  if (!(session.user.accountType == "user") && request.nextUrl.pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/user/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/user',
    '/user/:path*',
  ]
};
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
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
  runtime: "nodejs",
  matcher: [
    '/admin((?!/auth)(/.*)?)',
    '/user((?!/auth)(/.*)?)',
  ],
};
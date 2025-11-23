import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get locale from cookie
  const locale = request.cookies.get("lang")?.value || "en";
  
  // Clone the request headers and add the locale
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Match all paths except static files and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};

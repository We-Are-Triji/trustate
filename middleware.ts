import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRoutes = {
  client: [
    "/dashboard/transactions",
    "/dashboard/properties",
    "/dashboard/messages",
    "/dashboard/settings",
  ],
  agent: [
    "/dashboard/transactions",
    "/dashboard/clients",
    "/dashboard/listings",
    "/dashboard/messages",
    "/dashboard/settings",
  ],
  broker: [
    "/dashboard/agents",
    "/dashboard/transactions",
    "/dashboard/analytics",
    "/dashboard/firm",
    "/dashboard/settings",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing: ${pathname}`);

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // Optimization for static files (images, etc)
  ) {
    return NextResponse.next();
  }


  // Only check dashboard routes (excluding base /dashboard)
  if (pathname.startsWith("/dashboard/") && pathname !== "/dashboard") {
    // Get account type from cookie or header (you'll need to set this during login)
    const accountType = request.cookies.get("accountType")?.value as keyof typeof roleRoutes | undefined;

    if (accountType && roleRoutes[accountType]) {
      const allowedRoutes = roleRoutes[accountType];
      const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

      if (!isAllowed) {
        // Redirect to dashboard if trying to access unauthorized route
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};

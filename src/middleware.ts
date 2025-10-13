import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/perfil", "/configuracion", "/panel"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has auth token cookie
  const authToken = request.cookies.get("auth-token");
  const isAuthenticated = !!authToken?.value;

  // For protected routes, if not authenticated, redirect to login
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const url = new URL("/ingresar", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // For auth routes (/ingresar, /registro), if authenticated, redirect to panel
  const authRoutes = ["/ingresar", "/registro"];
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    const url = new URL("/panel", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

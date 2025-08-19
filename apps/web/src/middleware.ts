import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/perfil", "/configuracion"];

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = ["/ingresar", "/registro"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has auth tokens (simple check)
  const authStorage = request.cookies.get("auth-storage");
  let isAuthenticated = false;

  if (authStorage?.value) {
    try {
      const parsed = JSON.parse(authStorage.value);
      isAuthenticated = !!parsed.state?.tokens?.accessToken;
    } catch (error) {
      // If parsing fails, consider user as unauthenticated
      isAuthenticated = false;
    }
  }

  // If trying to access protected route without auth, redirect to login
  if (
    protectedRoutes.some(route => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const url = new URL("/ingresar", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access auth routes while authenticated, redirect to dashboard
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
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

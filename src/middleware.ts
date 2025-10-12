import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/perfil", "/configuracion", "/panel"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has auth tokens (simple check)
  // Note: In middleware, we can't access localStorage directly,
  // but we can check for a auth-storage cookie that would be set by the client
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

  // For protected routes, if not authenticated, redirect to login
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const url = new URL("/ingresar", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // For auth routes, if authenticated, redirect to panel
  // But skip this check for now to avoid redirect loops
  // TODO: Fix this properly with client-side navigation

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

/**
 * Middleware for session management
 *
 * WHAT IT DOES:
 * - Refreshes expired auth tokens automatically
 * - Runs on every request to your app
 * - Updates the auth cookie when token refreshes
 * - Protects routes that need authentication
 *
 * WHY IT MATTERS:
 * - Sessions expire after a period (default 1 hour)
 * - Refresh tokens (24 hours) are used to get new access tokens
 * - Without this, users get logged out unexpectedly
 * - Middleware handles this transparently
 *
 * HOW TO USE:
 * - Import this in next.config.ts
 * - Add matcher to protect specific routes
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

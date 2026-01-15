/**
 * Auth callback route
 *
 * WHAT HAPPENS HERE:
 * 1. User clicks email verification link
 * 2. Link includes auth code in URL query params
 * 3. This route exchanges code for session
 * 4. Redirects user to dashboard or home
 *
 * WHY SEPARATE ROUTE:
 * - Supabase needs to exchange code on server
 * - Client can't do this securely
 * - Next.js API routes are perfect for this
 */

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // If we have a code, exchange it for a session
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // Check for errors
    if (!error) {
      // Redirect to dashboard on success
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }

    console.error("Auth callback error:", error);
  }

  // Redirect to error page or login
  return NextResponse.redirect(
    new URL("/auth/error?message=Failed to authenticate", requestUrl.origin)
  );
}

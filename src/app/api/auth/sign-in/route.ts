/**
 * Sign in endpoint
 *
 * CLIENT CALLS THIS:
 * POST /api/auth/sign-in { email, password }
 *
 * WHAT HAPPENS:
 * 1. Receives credentials
 * 2. Calls Supabase auth.signInWithPassword
 * 3. Returns session or error
 *
 * WHY API ROUTE:
 * - Keeps credentials on server
 * - Reduces exposure in client code
 * - Can add rate limiting, logging here
 */

import { signIn } from "@/lib/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { data, message: "Signed in successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

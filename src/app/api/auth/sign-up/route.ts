/**
 * Sign up endpoint
 *
 * CLIENT CALLS THIS:
 * POST /api/auth/sign-up { email, password }
 *
 * WHAT HAPPENS:
 * 1. Validates input
 * 2. Calls Supabase auth.signUp
 * 3. Sends verification email (if email confirmation enabled)
 * 4. Returns confirmation needed message
 */

import { signUp } from "@/lib/supabase/auth";
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

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const { data, error } = await signUp(email, password);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        data,
        message: "Sign up successful. Check your email for verification.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

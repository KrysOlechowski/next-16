/**
 * Sign out endpoint
 *
 * CLIENT CALLS THIS:
 * POST /api/auth/sign-out
 *
 * WHAT HAPPENS:
 * 1. Calls Supabase auth.signOut
 * 2. Clears session cookie
 * 3. Returns success
 *
 * WHY API ROUTE:
 * - Ensures session is cleared on server
 * - Cookie is cleared automatically
 */

import { signOut } from "@/lib/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { error } = await signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

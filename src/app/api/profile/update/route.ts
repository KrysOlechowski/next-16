/**
 * Profile update API endpoint
 *
 * Handles updating user profile data
 * - Validates user is authenticated
 * - Updates profile in database
 * - RLS ensures users can only update their own profile
 */

import { getAuthUser } from "@/lib/supabase/server";
import { updateUserProfile } from "@/lib/supabase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { userId, full_name, bio, avatar_url } = await request.json();

    // Make sure user is updating their own profile
    if (userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Cannot update another user's profile" },
        { status: 403 }
      );
    }

    // Validate input
    if (full_name && typeof full_name === "string" && full_name.length > 100) {
      return NextResponse.json(
        { error: "Full name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (bio && typeof bio === "string" && bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Update profile in database
    const { data, error } = await updateUserProfile(user.id, {
      full_name,
      bio,
      avatar_url,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { data, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

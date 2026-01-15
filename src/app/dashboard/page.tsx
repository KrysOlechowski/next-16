/**
 * Dashboard page - PROTECTED (requires authentication)
 *
 * This is a SERVER COMPONENT
 * It can:
 * - Check if user is authenticated
 * - Fetch data from database securely
 * - Use Server-side Supabase
 *
 * HOW IT'S PROTECTED:
 * - getAuthUser() returns null if not authenticated
 * - We redirect to login if user is null
 * - This happens on the server (secure)
 */

import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/database";
import { UserMenu } from "@/components/auth/UserMenu";

export default async function DashboardPage() {
  // Get current user (returns null if not authenticated)
  const user = await getAuthUser();

  // If not authenticated, redirect to sign in
  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch user's profile from database
  const { data: profile, error: profileError } = await getUserProfile(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserMenu />
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* User info card */}
          <div>
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="bg-gray-50 rounded p-4 space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Signed up:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile data from database */}
          <div>
            <h2 className="text-xl font-bold mb-4">Profile Data</h2>
            {profileError ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-800 text-sm">
                  Error loading profile: {profileError.message}
                </p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure your Supabase database has a "profiles" table with
                  Row-Level Security policies set up.
                </p>
              </div>
            ) : profile ? (
              <div className="bg-gray-50 rounded p-4 space-y-2">
                <p>
                  <strong>Full Name:</strong> {profile.full_name || "Not set"}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio || "Not set"}
                </p>
                <p>
                  <strong>Avatar URL:</strong> {profile.avatar_url || "Not set"}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-yellow-800 text-sm">
                  No profile data found. Your profile table might not have a row
                  for this user yet.
                </p>
              </div>
            )}
          </div>

          {/* Architecture explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-bold text-blue-900 mb-2">How This Works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                ✓ This page is a Server Component - authentication check happens
                on server
              </li>
              <li>
                ✓ If you're not logged in, you're automatically redirected to
                /auth/sign-in
              </li>
              <li>✓ User data comes from Supabase Auth (built-in)</li>
              <li>
                ✓ Profile data comes from your database (RLS enforces access)
              </li>
              <li>
                ✓ UserMenu component on right shows your email and has logout
                button
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

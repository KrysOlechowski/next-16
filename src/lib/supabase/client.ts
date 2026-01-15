/**
 * Client-side Supabase client
 *
 * WHY THIS EXISTS:
 * - Runs in browser
 * - Uses ANONYMOUS KEY (limited permissions)
 * - Used in client components for real-time subscriptions
 * - Automatically handles auth state in browser
 *
 * SECURITY MODEL:
 * - Anonymous key has minimal permissions
 * - RLS policies enforce what users can access
 * - Safe to expose to frontend
 *
 * IMPORTANT:
 * - Use 'use client' in components that import this
 * - For data fetching, prefer server components + API routes
 * - This is mainly for real-time subscriptions and client state
 */

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}

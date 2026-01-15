/**
 * Database utilities - server-side data operations
 *
 * KEY CONCEPTS:
 *
 * 1. ROW-LEVEL SECURITY (RLS)
 *    Database enforces who can see/edit what, not your code.
 *    Example policy: "Users can only see their own records"
 *
 * 2. WHY SERVER-SIDE:
 *    - User is already authenticated (session in cookie)
 *    - Supabase client reads auth from cookie automatically
 *    - RLS policies use authenticated user's ID
 *    - Safer than client-side fetching
 *
 * 3. ERROR HANDLING:
 *    Supabase returns { data, error } pattern
 *    Always check error first
 */

import { createClient } from "./server";

/**
 * Get current user's profile
 * RLS Policy: users can only read their own record
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

/**
 * Update user profile
 * RLS Policy: users can only update their own record
 */
export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string; bio?: string }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

/**
 * Get user's posts
 * Example: Getting filtered data for current user
 */
export async function getUserPosts(userId: string, limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, updated_at")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

/**
 * Create a new post
 * RLS Policy: posts.author_id must equal current user ID
 * (Supabase automatically fills this via policy)
 */
export async function createPost(
  userId: string,
  title: string,
  content: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: userId,
      title,
      content,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a post
 * RLS Policy: users can only delete their own posts
 */
export async function deletePost(postId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  return { error };
}

/**
 * Get public posts (example of querying without user filter)
 * RLS Policy: all authenticated users can read public posts
 */
export async function getPublicPosts(limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author_id, created_at, profiles(full_name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

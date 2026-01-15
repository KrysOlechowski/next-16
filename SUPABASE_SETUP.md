# Supabase Setup Guide

## Overview

This boilerplate implements a **hybrid authentication architecture** for Next.js 16 with Supabase:

- **Server-side**: Secure session management, database queries, protected routes
- **Client-side**: Real-time UI updates, client-side auth state, subscriptions
- **API Routes**: Bridge between client and server

---

## 1. Supabase Project Setup

### Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Create a new organization (if needed)
4. Fill in:
   - Project name
   - Database password (save this!)
   - Region (closest to you)
5. Wait for project to initialize (~2 minutes)

### Get Your API Keys

1. Go to **Settings > API** in your project
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important**: The `anon` key is safe to expose in the browser. Never share the `service_role` key.

---

## 2. Environment Setup

### Create `.env.local`

Copy the template and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Database Setup (Optional but Recommended)

### Create the Profiles Table

In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row-Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to auto-create profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Create the Posts Table (Example)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Authors can view their own posts
CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Authors can insert their own posts
CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Public posts are readable by anyone
CREATE POLICY "Anyone can read public posts"
  ON posts FOR SELECT
  USING (is_public = true);
```

---

## 4. Enable Email Authentication

1. Go to **Authentication > Providers**
2. Click on **Email**
3. Configure:
   - **Confirm email** - Toggle ON (send verification email)
   - **Double confirm change** - Optional
4. Go to **Email Templates**
5. Find "Confirm signup" - customize the verification link
   - Make sure it points to `{{ .SiteURL }}/auth/callback`

---

## 5. Project Structure

```
src/
├── lib/supabase/
│   ├── server.ts          # Server-side Supabase client
│   ├── client.ts          # Client-side Supabase client
│   ├── auth.ts            # Auth utilities (signup, login, etc)
│   └── database.ts        # Database query utilities
├── app/
│   ├── auth/
│   │   ├── sign-up/       # Sign up page
│   │   ├── sign-in/       # Sign in page
│   │   └── verify-email/  # Email verification page
│   ├── api/auth/
│   │   ├── callback/      # OAuth/email callback
│   │   ├── sign-in/       # Sign in endpoint
│   │   ├── sign-up/       # Sign up endpoint
│   │   └── sign-out/      # Sign out endpoint
│   └── dashboard/         # Protected page (requires auth)
├── components/auth/
│   ├── SignUpForm.tsx     # Sign up UI
│   ├── SignInForm.tsx     # Sign in UI
│   ├── LogoutButton.tsx   # Logout button
│   └── UserMenu.tsx       # User menu with auth state
└── middleware.ts          # Session refresh middleware
```

---

## 6. Architecture Explanation

### Data Flow: Sign Up

```
Client (SignUpForm)
    ↓ (form submit)
POST /api/auth/sign-up
    ↓ (server)
Supabase Auth API (auth.signUp)
    ↓ (sends verification email)
User clicks email link → /auth/callback?code=...
    ↓ (exchange code)
Supabase Auth
    ↓ (sets session cookie)
Redirect to /dashboard
    ↓ (page loads)
Dashboard (Server Component)
    ↓ (getAuthUser reads cookie)
Authenticated ✓
```

### Data Flow: Access Protected Page

```
User visits /dashboard
    ↓
Next.js loads Dashboard (Server Component)
    ↓
getAuthUser() reads session from cookie
    ↓
No session? Redirect to /auth/sign-in
    ↓
Has session? Fetch database data
    ↓
Supabase enforces RLS (user can only see their data)
    ↓
Page renders with user's data
```

### Why Server Components?

- **Security**: Auth check happens on server, not client
- **Direct database access**: No need for API routes for simple queries
- **RLS enforcement**: Supabase automatically enforces row-level security based on authenticated user
- **Performance**: Server renders page, client gets HTML

---

## 7. Common Patterns

### Check if User is Authenticated (Server)

```typescript
import { getAuthUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <div>Welcome {user.email}!</div>;
}
```

### Get User's Data (Server)

```typescript
import { getUserProfile } from "@/lib/supabase/database";
import { getAuthUser } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/sign-in");

  const { data, error } = await getUserProfile(user.id);

  return <div>{data?.full_name}</div>;
}
```

### Display User in Client Component

```typescript
"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

export function UserDisplay() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return <div>User: {user?.email}</div>;
}
```

---

## 8. Testing the Boilerplate

### Test Sign Up Flow

1. Go to `http://localhost:3000/auth/sign-up`
2. Enter email and password
3. Click "Sign Up"
4. Check email for verification link
5. Click link → redirects to dashboard

### Test Protected Route

1. Try going to `http://localhost:3000/dashboard` without signing in
2. Should redirect to `/auth/sign-in`
3. Sign in with your credentials
4. Now you can access dashboard

### Check Database Data

1. In Supabase dashboard → **Table Editor**
2. Click `auth.users` → see your user account
3. Click `profiles` → see your profile (auto-created)
4. Try to manually edit rows → RLS policies block unauthorized access

---

## 9. Security Checklist

- [ ] Never commit `.env.local` to git (add to `.gitignore`)
- [ ] Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side
- [ ] Keep `service_role_key` secret (only in `.env.local`)
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test that users can't access other users' data
- [ ] Use middleware to refresh sessions automatically
- [ ] Validate input on both client and server

---

## 10. Next Steps

### Add More Features

1. **Real-time subscriptions**: Update `UserMenu.tsx` to use Supabase real-time
2. **OAuth providers**: Enable Google, GitHub in Auth Providers
3. **Password reset**: Implement `/auth/reset-password` flow
4. **User profiles**: Add `/dashboard/profile` to edit user data
5. **File upload**: Use Supabase Storage for avatars/images

### Production Deploy

1. Add production URL to `NEXT_PUBLIC_APP_URL`
2. Configure Supabase email templates for production
3. Add allowed redirect URLs in Supabase Auth settings
4. Test email verification links work in production

---

## Troubleshooting

### "Invalid API key" Error

- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify keys are from correct Supabase project
- Make sure `.env.local` is loaded (restart dev server)

### "RLS policy" Error

- Check that table has RLS policies configured
- Verify policy condition matches your use case
- Make sure `auth.uid()` is available in policy

### Email Verification Not Working

- Go to Supabase > Authentication > Email Templates
- Check "Confirm signup" template has correct redirect URL
- Verify email provider is configured (may need SMTP setup)
- Check spam folder

### User Auto-Created in Auth but Not in Profiles Table

- Run the SQL trigger creation script again
- Check function syntax is correct
- Verify trigger is active in Supabase

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth with Next.js SSR](https://supabase.com/docs/guides/auth/server-side)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

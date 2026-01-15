# Supabase Boilerplate - Quick Reference

## File Structure at a Glance

```
src/lib/supabase/
├── server.ts      → createClient(), getAuthUser(), getSession()
├── client.ts      → createSupabaseClient() for browser
├── auth.ts        → signUp(), signIn(), signOut(), resetPassword()
└── database.ts    → getUserProfile(), getUserPosts(), createPost(), etc.

src/app/api/auth/
├── callback/      → POST handler for email verification
├── sign-in/       → POST handler: receives email+password
├── sign-up/       → POST handler: receives email+password
└── sign-out/      → POST handler: clears session

src/components/auth/
├── SignUpForm.tsx    → Client form component for registration
├── SignInForm.tsx    → Client form component for login
├── LogoutButton.tsx  → Button that calls sign-out endpoint
└── UserMenu.tsx      → Shows current user + logout option

src/app/
├── auth/
│   ├── sign-up/      → /auth/sign-up page
│   ├── sign-in/      → /auth/sign-in page
│   └── verify-email/ → /auth/verify-email page
└── dashboard/        → /dashboard (PROTECTED, requires auth)

middleware.ts         → Auto-refresh sessions on every request
```

---

## How It Works: The Complete Flow

### 1. User Signs Up

```
Form Submit
  ↓
POST /api/auth/sign-up { email, password }
  ↓
Server: signUp() → Supabase Auth
  ↓
Supabase sends verification email
  ↓
User clicks link with code
  ↓
GET /auth/callback?code=xxx
  ↓
Server: exchangeCodeForSession()
  ↓
Session cookie set ✓
  ↓
Redirect to /dashboard
```

### 2. User Visits Protected Page

```
GET /dashboard
  ↓
Server Component loads
  ↓
getAuthUser() reads session cookie
  ↓
Not found? Redirect to /auth/sign-in
  ↓
Found? Continue
  ↓
getUserProfile(userId) queries database
  ↓
Supabase checks RLS policy
  ↓
Policy: user_id = auth.uid()? ✓
  ↓
Return user's profile data
  ↓
Server renders page → sends HTML to browser
```

### 3. User Logs Out

```
Click Logout
  ↓
POST /api/auth/sign-out
  ↓
Server: signOut()
  ↓
Session cookie deleted
  ↓
Redirect to /auth/sign-in
```

---

## Key Concepts

### Row-Level Security (RLS)

RLS is a **database-level policy** that determines what data each user can see.

**Example Policy**:

```sql
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

This means:

- `auth.uid()` = currently authenticated user's ID
- `id` = user_id column in profiles table
- Policy allows: `SELECT profiles WHERE auth.uid() = id`
- Result: Users can only see their own profile

**Why this matters**:

- Don't rely on client-side filtering (can be bypassed)
- Database enforces security, not your code
- Even if you make a mistake in your app, RLS protects data

### Server vs Client

| Aspect                  | Server Component  | Client Component         |
| ----------------------- | ----------------- | ------------------------ |
| Auth check              | `getAuthUser()`   | `createSupabaseClient()` |
| Direct DB access        | ✓ (with RLS)      | ✗ (only via API)         |
| Session reading         | ✓ (from cookie)   | ✗                        |
| Real-time subscriptions | ✗                 | ✓                        |
| API routes              | Can call directly | Must fetch               |

### Session Management

1. **First request**: User signs in
2. **Set cookie**: `secure, httpOnly` session cookie
3. **Every request**: Middleware reads cookie
4. **Auto-refresh**: Token expires? Use refresh_token to get new one
5. **No refresh token**: User is signed out

---

## Common Tasks

### Task: Add Email Verification

**Already included!**

- Sign up sends email
- User clicks link with code
- `/auth/callback` exchanges code for session

To customize email template:

1. Supabase Dashboard → Authentication → Email Templates
2. Edit "Confirm signup" template
3. Make sure redirect URL is `{{ .SiteURL }}/auth/callback`

### Task: Protect a Route

```typescript
// Page must check auth
import { getAuthUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/sign-in");

  return <div>Protected content</div>;
}
```

### Task: Create User Post

```typescript
// Server action or API route
import { createPost } from "@/lib/supabase/database";
import { getAuthUser } from "@/lib/supabase/server";

const user = await getAuthUser();
const { data, error } = await createPost(user.id, "My Post", "Post content...");
```

### Task: Real-time Updates (Client)

```typescript
"use client";

import { useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

export function RealtimeList() {
  useEffect(() => {
    const supabase = createSupabaseClient();

    const subscription = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          console.log("Change received!", payload);
          // Update UI
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return <div>Listening for changes...</div>;
}
```

---

## Environment Variables

```bash
# MUST be set
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# SHOULD be set
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OPTIONAL (advanced)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For admin operations only
```

---

## Testing Checklist

- [ ] Sign up with email → get verification email ✓
- [ ] Click verification link → session created ✓
- [ ] Visit /dashboard → see your data ✓
- [ ] Visit /dashboard without auth → redirect to login ✓
- [ ] Logout → session deleted ✓
- [ ] Sign in with credentials → session created ✓
- [ ] Refresh page → stay logged in ✓

---

## Common Errors & Fixes

| Error                       | Cause                              | Fix                                 |
| --------------------------- | ---------------------------------- | ----------------------------------- |
| `Invalid API key`           | Wrong keys in `.env.local`         | Copy keys again from Supabase       |
| `Database connection error` | Table doesn't exist                | Run SQL scripts to create tables    |
| `RLS policy` error          | Trying to access other user's data | Check RLS policies allow your query |
| `Session is null`           | User not authenticated             | Check cookie with DevTools          |
| `Email not received`        | Supabase SMTP not configured       | Configure SMTP in Supabase          |

---

## Layers of Security

1. **Client validation**: Form checks (email format, password length)
2. **Server validation**: API routes validate input again
3. **RLS policies**: Database prevents unauthorized data access
4. **Middleware**: Auto-refreshes tokens, protects routes
5. **HTTPS/Cookies**: `secure`, `httpOnly` flags on cookies

---

## Next Steps

1. **Copy `.env.local.example` to `.env.local`** and add Supabase keys
2. **Create Supabase tables** by running SQL scripts
3. **Test sign up flow**: `/auth/sign-up`
4. **Test protected page**: `/dashboard`
5. **Customize pages** for your app needs
6. **Add real-time features** using client subscriptions

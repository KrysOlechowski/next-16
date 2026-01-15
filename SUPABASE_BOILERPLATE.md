# Supabase Boilerplate - Complete Setup

## What Was Created

This boilerplate provides a **production-ready** Supabase integration for Next.js 16 with server-side auth, database queries, and RLS security patterns.

---

## 📁 File Structure

### Core Supabase Utilities

```
src/lib/supabase/
├── server.ts          # Server-side client (cookies, RLS)
├── client.ts          # Browser-side client (real-time)
├── auth.ts            # Auth operations (signup, login, logout)
└── database.ts        # Database queries with RLS examples
```

### API Routes (Serverless Functions)

```
src/app/api/auth/
├── callback/route.ts  # Email verification callback
├── sign-in/route.ts   # Login endpoint
├── sign-up/route.ts   # Registration endpoint
└── sign-out/route.ts  # Logout endpoint
```

### Auth Pages (Frontend)

```
src/app/auth/
├── sign-up/page.tsx       # Registration page
├── sign-in/page.tsx       # Login page
└── verify-email/page.tsx  # Email verification message
```

### Auth Components (Reusable UI)

```
src/components/auth/
├── SignUpForm.tsx       # Registration form component
├── SignInForm.tsx       # Login form component
├── LogoutButton.tsx     # Logout button component
└── UserMenu.tsx         # User display + logout
```

### Protected Routes

```
src/app/
└── dashboard/page.tsx   # Example protected page
```

### Configuration

```
middleware.ts               # Session auto-refresh
.env.local.example         # Environment template
```

### Documentation

```
SUPABASE_SETUP.md          # Step-by-step setup guide
SUPABASE_QUICKREF.md       # Quick reference for common tasks
SUPABASE_ARCHITECTURE.md   # Deep dive on why things work
```

---

## 🚀 Quick Start

### 1. Copy Environment File

```bash
cp .env.local.example .env.local
```

### 2. Add Supabase Credentials

Edit `.env.local` with your Supabase project keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Create Database Tables

Run SQL in Supabase Dashboard → SQL Editor:

- See `SUPABASE_SETUP.md` for full scripts

### 4. Start Dev Server

```bash
bun run dev
```

### 5. Test It

- Sign up: http://localhost:3000/auth/sign-up
- Sign in: http://localhost:3000/auth/sign-in
- Protected: http://localhost:3000/dashboard

---

## 📚 Documentation

### For Setup & Configuration

👉 **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

- Creating Supabase project
- Environment variables
- Database table creation
- Email setup
- Common errors & fixes

### For Daily Development

👉 **[SUPABASE_QUICKREF.md](SUPABASE_QUICKREF.md)**

- File structure overview
- How data flows
- Common tasks & code examples
- Security checklist
- Testing checklist

### For Understanding the Design

👉 **[SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)**

- Why this architecture exists
- Each design decision & alternatives
- Security layers explained
- Data flow examples
- Common pitfalls & solutions

---

## 🔐 Security Features Included

✅ **Server-Side Sessions**

- Sessions stored in secure `httpOnly` cookies
- Can't be accessed by JavaScript
- Auto-refresh on expired tokens

✅ **Row-Level Security (RLS)**

- Database enforces `WHERE auth.uid() = user_id`
- No data leaks even if code has bugs
- Works across all API routes

✅ **Protected Routes**

- Server Components check auth before rendering
- Instant redirect (no loading flash)
- Can't be bypassed by modifying client code

✅ **Middleware Auto-Refresh**

- Tokens auto-refresh on every request
- Users never get logged out unexpectedly
- Seamless experience

✅ **Input Validation**

- Client-side: User feedback
- Server-side: Security enforcement
- Database-level: RLS policies

---

## 🎯 Use Cases Covered

### Authentication

- ✅ Email/password signup
- ✅ Email verification
- ✅ Email/password login
- ✅ Session management
- ✅ Logout
- 🔧 Ready for: OAuth (Google, GitHub), password reset

### Data Access

- ✅ User-specific data queries
- ✅ Create/read/update/delete examples
- ✅ RLS policy patterns
- ✅ Database triggers (auto-create profile)
- 🔧 Ready for: Real-time subscriptions, aggregations

### UI/UX

- ✅ Sign up form with validation
- ✅ Sign in form
- ✅ Protected page with loading state
- ✅ User menu component
- ✅ Error handling & messages
- ✅ Responsive design (Tailwind)

---

## 🔗 Key API Reference

### Server Functions (Backend)

```typescript
// Authentication
import { signUp, signIn, signOut } from "@/lib/supabase/auth";
import { getAuthUser, getSession } from "@/lib/supabase/server";

// Database
import {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  createPost,
  deletePost,
} from "@/lib/supabase/database";
```

### Client Hooks (Frontend)

```typescript
// Get Supabase client in browser
import { createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

// Real-time subscriptions
supabase
  .channel('posts')
  .on('postgres_changes', { ... })
  .subscribe();
```

### Components (UI)

```typescript
// Import ready-to-use components
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignInForm } from "@/components/auth/SignInForm";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { UserMenu } from "@/components/auth/UserMenu";
```

---

## 📊 Architecture Diagram

```
Browser                 Next.js Server              Supabase
─────────               ──────────────              ─────────

Client Component    →   API Route              →   PostgreSQL
(SignUpForm)            (sign-up)                   (auth.users)
                            ↓                           ↓
                        Validation               Database Trigger
                            ↓                           ↓
                    Supabase Auth API           Create Profile
                            ↓                           ↓
                        Send Email              RLS Policy Applied
                            ↓
                    User clicks link
                            ↓
GET /auth/callback  ←   Exchange Code
                            ↓
                    Session Cookie Set
                            ↓
    Redirect to     ←   /dashboard
    Dashboard            ↓
                    Server Component
                            ↓
                    Check: getAuthUser()
                            ↓
                    Query: getUserProfile()
                            ↓
                    RLS: auth.uid() = id ✓
                            ↓
                    Return user's data only
```

---

## 🧪 Testing The Boilerplate

### Test 1: Sign Up Flow

1. Go to `http://localhost:3000/auth/sign-up`
2. Enter email and password
3. Click "Sign Up"
4. Check email for verification link
5. Click link → should redirect to `/dashboard`
6. ✓ You're now authenticated!

### Test 2: Protected Route

1. Try `http://localhost:3000/dashboard` without signing in
2. ✓ Should redirect to `/auth/sign-in`
3. Sign in with your credentials
4. ✓ Can now see dashboard

### Test 3: RLS Policies

1. Sign in as User A
2. Check Supabase → Table Editor → profiles
3. You only see your own profile row
4. Try to edit another user's row → ✓ Permission denied
5. Try to query `SELECT * FROM profiles` via API → ✓ Only your row returned

### Test 4: Session Refresh

1. Sign in (creates session)
2. Open DevTools → Application → Cookies
3. See `sb-...` cookie (session)
4. Keep page open for 1+ hour
5. Make a request (click something)
6. ✓ Token refreshed automatically (no re-login needed)

---

## 🛠️ Customization Examples

### Add OAuth (Google/GitHub)

In Supabase Dashboard:

1. Authentication → Providers → Enable Google
2. Add API credentials
3. Update `SignInForm` to add OAuth button

### Add Password Reset

```typescript
// Already in auth.ts:
import { resetPassword, updatePassword } from "@/lib/supabase/auth";

// Create reset-password page and route
```

### Add Real-Time Updates

```typescript
"use client";
import { useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

export function RealtimePosts() {
  useEffect(() => {
    const supabase = createSupabaseClient();

    supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          /* update UI */
        }
      )
      .subscribe();
  }, []);
}
```

### Add File Storage

```typescript
// Upload avatar
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.jpg`, file);

// Update profile with avatar URL
await updateUserProfile(userId, { avatar_url: data.path });
```

---

## 📖 Learning Path

1. **Start**: Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Get everything configured
2. **Test**: Follow testing checklist - Make sure it works
3. **Reference**: Use [SUPABASE_QUICKREF.md](SUPABASE_QUICKREF.md) - Common tasks
4. **Deep Dive**: Study [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) - Understand why
5. **Build**: Customize components & create your features

---

## 🆘 Troubleshooting

| Problem                 | Solution                                                |
| ----------------------- | ------------------------------------------------------- |
| Invalid API key         | Check `.env.local` has correct Supabase keys            |
| RLS policy error        | Make sure all tables have RLS enabled with policies     |
| Email not received      | Configure Supabase SMTP (Settings → Email Templates)    |
| Session expires quickly | Middleware might not be running - check `middleware.ts` |
| Can't access /dashboard | Make sure you're signed in - check cookies in DevTools  |

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md#troubleshooting) for detailed solutions.

---

## ✨ Features Summary

| Feature             | Status           | Location                        |
| ------------------- | ---------------- | ------------------------------- |
| Email/password auth | ✅ Complete      | `/src/app/auth/`                |
| Session management  | ✅ Complete      | `middleware.ts`                 |
| Protected routes    | ✅ Complete      | `/src/app/dashboard/`           |
| Database queries    | ✅ Complete      | `/src/lib/supabase/database.ts` |
| RLS examples        | ✅ Complete      | `SUPABASE_SETUP.md`             |
| User profile        | ✅ Complete      | `/src/lib/supabase/database.ts` |
| Logout              | ✅ Complete      | `/src/components/auth/`         |
| Form validation     | ✅ Complete      | `/src/components/auth/`         |
| Error handling      | ✅ Complete      | All routes                      |
| Real-time ready     | 🔧 Framework set | `/src/lib/supabase/client.ts`   |
| OAuth ready         | 🔧 Framework set | Components can be extended      |
| File storage ready  | 🔧 Framework set | Need to add to auth.ts          |

---

## 📞 Need Help?

1. **Setup issues?** → Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. **How do I...?** → Check [SUPABASE_QUICKREF.md](SUPABASE_QUICKREF.md)
3. **Why does it work like this?** → See [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)
4. **Code doesn't run?** → Check lint errors: `bun run lint`
5. **Still stuck?** → Check Supabase docs: https://supabase.com/docs

---

**Ready to go!** 🚀

Your boilerplate is production-ready. Start building your app on top of this secure foundation.

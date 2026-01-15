# System Overview & Data Flows

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  React Components (UI Layer)                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │ SignUpForm  │  │ SignInForm  │  │ Dashboard    │  │ UserMenu  │  │   │
│  │  │ (Form UX)   │  │ (Form UX)   │  │ (Protected)  │  │ (Display) │  │   │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  └───────────┘  │   │
│  │        ↕ User Input & Display                                        │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  Browser Supabase Client (src/lib/supabase/client.ts)                │   │
│  │  - Manages auth state                                                │   │
│  │  - Handles real-time subscriptions                                   │   │
│  │  - Uses ANONYMOUS KEY (limited permissions)                          │   │
│  │  - Can't make privileged database queries                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────┬─────────────────────────────────────┘
                                         │
                                   HTTP + Cookies
                                   (Session Token)
                                         │
                                         ↓
┌────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS SERVER LAYER                               │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ middleware.ts                                                         │ │
│  │ ├─ Runs on EVERY request                                             │ │
│  │ ├─ Reads session from cookie                                         │ │
│  │ ├─ Token expired? → Use refresh_token to get new one                │ │
│  │ └─ Update cookie with new session                                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                   ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Server Components & API Routes                                       │ │
│  │ ├─ /app/dashboard/page.tsx      (Server Component)                   │ │
│  │ │  ├─ getAuthUser() → validate session                              │ │
│  │ │  ├─ Not auth? → redirect("/auth/sign-in")                         │ │
│  │ │  ├─ getUserProfile(user.id) → query database                      │ │
│  │ │  └─ Render page with user's data                                  │ │
│  │ │                                                                     │ │
│  │ ├─ /api/auth/sign-up             (API Route)                        │ │
│  │ │  ├─ Receive { email, password }                                   │ │
│  │ │  ├─ Validate input                                                │ │
│  │ │  ├─ Call supabase.auth.signUp()                                   │ │
│  │ │  ├─ Send verification email                                       │ │
│  │ │  └─ Return { success: true }                                      │ │
│  │ │                                                                     │ │
│  │ ├─ /api/auth/sign-in             (API Route)                        │ │
│  │ │  ├─ Receive { email, password }                                   │ │
│  │ │  ├─ Call supabase.auth.signInWithPassword()                       │ │
│  │ │  ├─ Supabase returns session                                      │ │
│  │ │  └─ Cookie automatically set                                      │ │
│  │ │                                                                     │ │
│  │ ├─ /api/auth/sign-out            (API Route)                        │ │
│  │ │  ├─ Call supabase.auth.signOut()                                  │ │
│  │ │  ├─ Session cookie cleared                                        │ │
│  │ │  └─ Redirect to sign-in                                           │ │
│  │ │                                                                     │ │
│  │ └─ /auth/callback                (OAuth/Email callback)             │ │
│  │    ├─ Receive ?code=...                                              │ │
│  │    ├─ Exchange code for session                                      │ │
│  │    └─ Cookie set, redirect to dashboard                             │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                   ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Server Supabase Client (src/lib/supabase/server.ts)                 │ │
│  │ ├─ Reads session from HTTP cookies                                  │ │
│  │ ├─ Validates session token                                          │ │
│  │ ├─ Extracts user ID from token                                      │ │
│  │ └─ Passes auth context to RLS policies                              │ │
│  │                                                                       │ │
│  │ Database Utilities (src/lib/supabase/database.ts)                   │ │
│  │ ├─ getUserProfile(userId)                                           │ │
│  │ ├─ getUserPosts(userId)                                             │ │
│  │ ├─ createPost(userId, title, content)                               │ │
│  │ ├─ updateUserProfile(userId, updates)                               │ │
│  │ └─ deletePost(postId)                                               │ │
│  │                                                                       │ │
│  │ Auth Utilities (src/lib/supabase/auth.ts)                            │ │
│  │ ├─ signUp(email, password)                                          │ │
│  │ ├─ signIn(email, password)                                          │ │
│  │ ├─ signOut()                                                         │ │
│  │ └─ resetPassword(email)                                              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │
                              PostgreSQL Protocol
                                     │
                                     ↓
┌────────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Managed Backend)                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Authentication Layer (auth.*)                                        │ │
│  │ ├─ auth.users         (user accounts, managed by Supabase)           │ │
│  │ ├─ auth.sessions      (active sessions)                              │ │
│  │ ├─ auth.refresh_tokens (long-lived refresh tokens)                   │ │
│  │ └─ auth.identities    (OAuth provider links)                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ PostgreSQL Database (public.*)                                       │ │
│  │ ├─ profiles           (user profiles)                                │ │
│  │ │  ├─ id (FK: auth.users.id)                                        │ │
│  │ │  ├─ full_name                                                      │ │
│  │ │  ├─ bio                                                            │ │
│  │ │  ├─ avatar_url                                                     │ │
│  │ │  └─ created_at                                                     │ │
│  │ │                                                                     │ │
│  │ ├─ posts              (user posts)                                   │ │
│  │ │  ├─ id                                                             │ │
│  │ │  ├─ author_id (FK: auth.users.id)                                 │ │
│  │ │  ├─ title                                                          │ │
│  │ │  ├─ content                                                        │ │
│  │ │  ├─ is_public                                                      │ │
│  │ │  └─ created_at                                                     │ │
│  │ │                                                                     │ │
│  │ └─ (Your other tables with RLS policies)                             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Row-Level Security (RLS) Policies                                   │ │
│  │ ├─ profiles:                                                         │ │
│  │ │  ├─ SELECT: WHERE auth.uid() = id                                 │ │
│  │ │  └─ UPDATE: WHERE auth.uid() = id                                 │ │
│  │ │                                                                     │ │
│  │ ├─ posts:                                                            │ │
│  │ │  ├─ SELECT own: WHERE auth.uid() = author_id                      │ │
│  │ │  ├─ SELECT public: WHERE is_public = true                         │ │
│  │ │  ├─ INSERT: WITH CHECK (auth.uid() = author_id)                   │ │
│  │ │  ├─ UPDATE: WHERE auth.uid() = author_id                          │ │
│  │ │  └─ DELETE: WHERE auth.uid() = author_id                          │ │
│  │ │                                                                     │ │
│  │ └─ (RLS policies prevent unauthorized data access at database level) │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Database Triggers & Functions                                       │ │
│  │ ├─ handle_new_user()                                                 │ │
│  │ │  └─ Runs when new user created in auth.users                      │ │
│  │ │     └─ AUTO-INSERTS row into profiles table                       │ │
│  │ │                                                                     │ │
│  │ └─ on_auth_user_created TRIGGER                                      │ │
│  │    └─ Executes handle_new_user() for each new auth user              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Sign Up Flow (Step by Step)

```
┌─────────────┐
│  User opens │
│ /auth/sign-up
└──────┬──────┘
       │
       ↓
┌─────────────────────────┐
│ Browser renders         │
│ SignUpForm component    │
│ (form with inputs)      │
└──────┬──────────────────┘
       │
       ↓ User fills form
┌─────────────────────────┐
│ User clicks "Sign Up"   │
│ Form validates:         │
│ - Email format? ✓       │
│ - Password length? ✓    │
│ - Passwords match? ✓    │
└──────┬──────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│ POST /api/auth/sign-up             │
│ Body: {                            │
│   email: "user@example.com",       │
│   password: "secure123"            │
│ }                                  │
└──────┬─────────────────────────────┘
       │
       ↓ Server receives request
┌────────────────────────────────────┐
│ Server validates again:            │
│ - Email & password present? ✓      │
│ - Password >= 8 chars? ✓           │
│ - Email format valid? ✓            │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│ Call: supabase.auth.signUp({...})  │
│                                    │
│ Supabase Auth Service:             │
│ 1. Hash password with bcrypt       │
│ 2. Create user in auth.users       │
│ 3. Generate verification token     │
│ 4. Send verification email         │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│ Database Trigger Fires:            │
│ on_auth_user_created               │
│                                    │
│ Execute: handle_new_user()         │
│ - Extract user ID from auth.users  │
│ - Insert into profiles table:      │
│   {                                │
│     id: <user_id>,                 │
│     full_name: null,               │
│     bio: null,                     │
│     avatar_url: null               │
│   }                                │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│ RLS Policy Applies:                │
│ CREATE POLICY                      │
│   "Users can view own profile"     │
│   WHERE id = auth.uid()            │
│                                    │
│ ✓ Profile auto-created             │
│ ✓ User can only see their own      │
└──────┬─────────────────────────────┘
       │
       ↓ Email sent to user
┌────────────────────────────────────┐
│ Response to Browser:               │
│ {                                  │
│   message: "Check your email"      │
│ }                                  │
│                                    │
│ Redirect to: /auth/verify-email    │
└──────┬─────────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│ User sees:                       │
│ "Check your email for link"      │
│                                  │
│ User checks email inbox →        │
│ Clicks verification link:        │
│ https://app.com/auth/callback?   │
│   code=abc123xyz...              │
└──────┬───────────────────────────┘
       │
       ↓ Browser follows link
┌──────────────────────────────────┐
│ GET /auth/callback?code=abc123xyz│
└──────┬───────────────────────────┘
       │
       ↓ Server receives callback
┌──────────────────────────────────────┐
│ Server-side handler:                 │
│                                      │
│ Extract code from URL                │
│ Call: supabase.auth                  │
│   .exchangeCodeForSession(code)      │
│                                      │
│ Supabase validates code:             │
│ - Code exists? ✓                     │
│ - Code not expired? ✓                │
│ - Code for correct email? ✓          │
│                                      │
│ Return: { session, user }            │
│ session contains:                    │
│ - access_token                       │
│ - refresh_token                      │
│ - expires_in                         │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Supabase JS Client auto-sets cookie: │
│                                      │
│ Set-Cookie: sb-access-token=xyz...  │
│   secure                             │
│   httpOnly                           │
│   sameSite=Lax                       │
│                                      │
│ (JS can't read this, only browser    │
│  sends it with requests)             │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Server redirects browser:            │
│ Location: /dashboard                 │
└──────┬───────────────────────────────┘
       │
       ↓ Browser navigates to /dashboard
┌──────────────────────────────────────┐
│ Server loads Dashboard component:    │
│                                      │
│ 1. Middleware runs:                  │
│    - Reads cookie                    │
│    - Validates session               │
│    - Cookie updated                  │
│                                      │
│ 2. Server Component executes:        │
│    - getAuthUser() reads cookie      │
│    - ✓ User found: user@example.com  │
│    - getUserProfile(user.id)         │
│    - Query database with RLS         │
│                                      │
│ 3. RLS Policy Enforces:              │
│    SELECT * FROM profiles            │
│    WHERE id = auth.uid()             │
│    (auth.uid() = verified user's ID) │
│    - ✓ Returns user's profile        │
│                                      │
│ 4. Page renders with data            │
│                                      │
│ 5. HTML sent to browser              │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Browser receives HTML                │
│                                      │
│ User sees:                           │
│ ┌──────────────────────────────────┐ │
│ │ Dashboard                        │ │
│ │                                  │ │
│ │ Welcome user@example.com         │ │
│ │ User ID: xxxxx-xxxxx-xxxxx       │ │
│ │ Profile: John Doe                │ │
│ │ ...                              │ │
│ │                                  │ │
│ │ [Log Out]                        │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ✓✓✓ SIGN UP COMPLETE ✓✓✓             │
└──────────────────────────────────────┘
```

---

## 🔒 Security Gates (Defense in Depth)

```
Attacker tries to access another user's profile
                          │
                          ↓
         ┌─────────────────────────────────┐
         │ GATE 1: Server Component Check  │
         ├─────────────────────────────────┤
         │ getAuthUser() reads cookie      │
         │ Is token valid?                 │
         │ Is token NOT expired?           │
         │ Attack: Try to fake token       │
         │ Result: ✓ Request blocked       │
         │ (Middleware auto-refreshes, so  │
         │  only valid tokens get through) │
         └────────────────────┬────────────┘
                              │
        (Attacker gets past with their own token)
                              │
                              ↓
         ┌─────────────────────────────────┐
         │ GATE 2: Application Logic       │
         ├─────────────────────────────────┤
         │ getUserProfile(other_user_id)   │
         │ Calls database query            │
         │ Attack: Modify query to get     │
         │         other_user_id           │
         │ Result: ✓ RLS policy enforced   │
         │ (Request sent to Supabase)      │
         └────────────────────┬────────────┘
                              │
                              ↓
         ┌─────────────────────────────────────┐
         │ GATE 3: Row-Level Security (RLS)    │
         ├─────────────────────────────────────┤
         │ Database Query Received:            │
         │ SELECT * FROM profiles              │
         │ WHERE id = ?                        │
         │                                     │
         │ RLS Policy Checks:                  │
         │ WHERE id = auth.uid()               │
         │                                     │
         │ Evaluation:                         │
         │ ? = other_user_id                   │
         │ auth.uid() = attacker's ID          │
         │                                     │
         │ Condition: other_user_id = attacker │
         │ Result: FALSE ✗                     │
         │                                     │
         │ ✓ Query returns 0 rows              │
         │ ✓ Attacker gets nothing             │
         └────────────────────┬────────────────┘
                              │
                              ↓
         ┌─────────────────────────────────┐
         │ Response to Attacker            │
         ├─────────────────────────────────┤
         │ { data: null, error: null }     │
         │                                 │
         │ Attacker sees: no data          │
         │ ✓✓ ATTACK BLOCKED AT DB LEVEL   │
         └─────────────────────────────────┘
```

---

## 🧬 Authentication State Machine

```
                          START
                            │
                            ↓
                    ┌───────────────┐
                    │ Not Signed In  │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │ User visits /auth/sign-up │
              │ or /auth/sign-in          │
              └──────────────┬────────────┘
                            │
                ┌───────────┴────────────┐
                │                       │
                ↓                       ↓
          [Sign Up]              [Sign In]
                │                       │
                ├─ Validate input       │
                ├─ Hash password        ├─ Validate input
                ├─ Store in DB          ├─ Check password
                ├─ Send email           │
                └─ Return to UI         └────┬────────┘
                                            │
                                            ↓
              ┌─────────────────────────────────────┐
              │ Email Sent / Credentials Valid      │
              │ Session NOT yet created             │
              └──────────────┬──────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │ User clicks verification link OR      │
        │ Sign in creates session immediately  │
        └──────────────┬──────────────────────┘
                      │
                      ↓
        ┌──────────────────────────────┐
        │ /auth/callback exchanges code│
        │ OR /api/auth/sign-in         │
        │                              │
        │ Session created:             │
        │ - access_token               │
        │ - refresh_token              │
        │ - Cookie set (httpOnly)      │
        └──────────┬───────────────────┘
                  │
                  ↓
          ┌───────────────┐
          │ SIGNED IN ✓   │
          │ auth.uid() is │
          │ available     │
          └───────┬───────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    │             │ Token valid?
    │             │ 1+ hour?
    │             │
    │             ├─ YES: Continue
    │             │
    │             └─ NO: Middleware refreshes
    │               using refresh_token
    │               Sets new cookie
    │               User stays signed in ✓
    │
    │ Or:
    │ User clicks Log Out
    │
    ↓ Session deleted
    │ Cookie cleared
    │
    ↓
┌─────────────────────┐
│ NOT SIGNED IN again │
└─────────────────────┘
```

---

## 🛡️ Cookie Security Flags Explained

```
When Supabase creates a session cookie:

Set-Cookie: sb-access-token=eyJhbGc...;
            Path=/;                         ← Cookie sent to all paths
            Domain=.example.com;            ← Cookie sent to all subdomains
            Expires=2026-01-22T10:30:00Z;  ← When cookie expires
            HttpOnly;                       ← JavaScript CANNOT read this
                                            │  (prevents XSS attacks)
            Secure;                         ← Only sent over HTTPS
                                            │  (prevents MITM attacks)
            SameSite=Lax;                   ← Not sent in cross-site requests
                                            │  (prevents CSRF attacks)
            Max-Age=3600;                   ← Expires in 3600 seconds (1 hour)
```

**Security Implications:**

- `HttpOnly`: If attacker injects JS, they can't steal token
- `Secure`: Only sent over encrypted HTTPS, never in plain HTTP
- `SameSite=Lax`: Can't be stolen by cross-site request forgery
- `Max-Age`: Token expires, forcing re-authentication

---

## 📝 Request/Response Examples

### Example 1: Sign Up Request

```http
POST /api/auth/sign-up HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "SecurePassword123"
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Sign up successful. Check your email for verification."
}
```

### Example 2: Sign In Request

```http
POST /api/auth/sign-in HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "SecurePassword123"
}

HTTP/1.1 200 OK
Set-Cookie: sb-access-token=eyJhbGc...; HttpOnly; Secure
Set-Cookie: sb-refresh-token=...; HttpOnly; Secure
Content-Type: application/json

{
  "data": {
    "user": { "id": "123e456", "email": "alice@example.com" }
  },
  "message": "Signed in successfully"
}
```

### Example 3: Protected Route Request (with Cookie)

```http
GET /dashboard HTTP/1.1
Host: localhost:3000
Cookie: sb-access-token=eyJhbGc...

HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <body>
    <h1>Dashboard</h1>
    <p>Welcome alice@example.com</p>
    ...
  </body>
</html>
```

### Example 4: Database Query (Server-Side)

```http
POST https://your-project.supabase.co/rest/v1/profiles?select=* HTTP/1.1
Authorization: Bearer eyJhbGc...
Content-Type: application/json

(Query automatically includes RLS checks)

HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "123e456",
    "full_name": "Alice",
    "bio": "Software developer",
    "avatar_url": "https://..."
  }
]
```

---

## 🔑 Keys & Permissions

```
ANONYMOUS KEY (Public - Safe to expose)
├─ Can sign up users
├─ Can sign in users
├─ Can call functions marked "public"
├─ ✓ Can see data allowed by RLS
├─ ✗ Can't see data blocked by RLS
├─ ✗ Can't bypass RLS
└─ Used in: Browser (createSupabaseClient)

SERVICE ROLE KEY (Secret - NEVER expose)
├─ Has ALL permissions
├─ Can bypass RLS (if you want)
├─ Can delete users, reset passwords, etc.
├─ Used for admin operations only
├─ Should ONLY be used server-side
└─ Store in: .env.local (never commit)

SESSION TOKEN (From auth.signIn)
├─ Contains user's ID and permissions
├─ Gets set in httpOnly cookie
├─ Expires in ~1 hour
├─ Auto-refreshed by middleware
├─ RLS uses this to know current user
└─ auth.uid() reads from this token
```

---

This architecture provides **security, performance, and developer experience** all at once. 🎯

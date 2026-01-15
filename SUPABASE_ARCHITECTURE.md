# Supabase Architecture Deep Dive

## Why This Architecture Exists

This boilerplate uses a **hybrid server + client approach**. Here's why each part matters.

---

## Part 1: The Problem We're Solving

### Authentication Challenge

When building a web app with auth, you face these questions:

1. **Where do we store sessions?**

   - In memory? (Lost on server restart)
   - In cookies? (Secure if `httpOnly`)
   - In localStorage? (Vulnerable to XSS)

2. **How do we prevent unauthorized data access?**

   - Client-side checks? (Can be bypassed in DevTools)
   - API route validation? (Better, but complex)
   - Database-level policies? (Best, always enforced)

3. **How do we handle expired tokens?**

   - Refresh manually? (Poor UX)
   - Auto-refresh in middleware? (Transparent to user)

4. **Who should check if user is logged in?**
   - Client? (User could fake it)
   - Server? (Authoritative, can't be bypassed)

---

## Part 2: Our Solution Architecture

```
┌─────────────────────────────────────────────┐
│          Browser (Client)                   │
│  ┌───────────────────────────────────────┐ │
│  │  React Components (Client)            │ │
│  │  - SignUpForm, SignInForm             │ │
│  │  - User interaction                   │ │
│  └───────────────────────────────────────┘ │
│            ↓ (HTTP)                        │
│  ┌───────────────────────────────────────┐ │
│  │  Supabase JS Client                   │ │
│  │  - Real-time subscriptions            │ │
│  │  - Client-side auth state             │ │
│  │  - Uses ANON KEY (limited)            │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
          ↕ (HTTP + Cookie)
┌─────────────────────────────────────────────┐
│         Next.js Server (Backend)            │
│  ┌───────────────────────────────────────┐ │
│  │  Middleware                           │ │
│  │  - Refresh expired tokens             │ │
│  │  - Update session cookie              │ │
│  └───────────────────────────────────────┘ │
│            ↓                                │
│  ┌───────────────────────────────────────┐ │
│  │  Server Components & API Routes       │ │
│  │  - Check authentication               │ │
│  │  - Query database securely            │ │
│  │  - Handle sensitive operations        │ │
│  └───────────────────────────────────────┘ │
│            ↓                                │
│  ┌───────────────────────────────────────┐ │
│  │  Supabase Server Client               │ │
│  │  - Uses session from cookie           │ │
│  │  - Can use SERVICE ROLE KEY           │ │
│  │  - Reads auth context from session    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
          ↓ (PostgreSQL)
┌─────────────────────────────────────────────┐
│      Supabase (Managed PostgreSQL)          │
│  ┌───────────────────────────────────────┐ │
│  │  Row-Level Security Policies          │ │
│  │  - WHERE auth.uid() = user_id         │ │
│  │  - Enforced at database level         │ │
│  │  - Can't be bypassed from app         │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Auth Tables (managed by Supabase)    │ │
│  │  - auth.users                         │ │
│  │  - auth.sessions                      │ │
│  │  - auth.refresh_tokens                │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Your Tables (with RLS policies)      │ │
│  │  - profiles                           │ │
│  │  - posts                              │ │
│  │  - etc.                               │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Part 3: Key Design Decisions & Why

### Decision 1: Store Sessions in Cookies (Not localStorage)

**Option A: localStorage**

```javascript
// ❌ NOT RECOMMENDED
localStorage.setItem("token", token);
// Vulnerable to XSS attacks
// Attacker's JS can read: localStorage.getItem("token")
```

**Option B: Cookies with httpOnly flag** ✅

```javascript
// ✓ RECOMMENDED
Set-Cookie: session=abc123; httpOnly; secure; sameSite=Lax
// JavaScript cannot access (httpOnly)
// Only sent over HTTPS (secure)
// Only sent to same domain (sameSite)
```

**Why**: If attacker injects JS, they can't steal the session token.

---

### Decision 2: Use Server Components for Auth Checks

**Option A: Check on Client**

```typescript
"use client";

export function ProtectedComponent() {
  const user = useSupabaseClient().auth.getUser();

  if (!user) {
    // ❌ User sees loading state, then redirect
    // ❌ API calls might happen before redirect
  }
}
```

**Option B: Check on Server** ✅

```typescript
// Server Component (default)

export default async function ProtectedPage() {
  const user = await getAuthUser();

  if (!user) {
    // ✓ Instant redirect before HTML renders
    // ✓ No data fetches for unauthenticated users
    // ✓ Can't be bypassed by modifying client code
    redirect("/auth/sign-in");
  }
}
```

**Why**:

- Server can't be bypassed by modifying browser code
- Faster redirect (no loading state)
- Instant, no flash of content

---

### Decision 3: Enforce Security at Database Level (RLS)

**Option A: Trust Application Code**

```typescript
// ❌ DON'T DO THIS
const posts = await db.query("SELECT * FROM posts WHERE author_id = ?", [
  userId,
]);
// Bug in app? User sees other people's posts
// Attacker modifies request? They get everyone's posts
```

**Option B: Use Row-Level Security** ✅

```sql
-- ✓ Database enforces this
CREATE POLICY "Users can only see their own posts"
  ON posts
  FOR SELECT
  USING (auth.uid() = author_id);
```

**Why**:

- Bugs in app can't expose data
- API routes can't bypass it
- Admin/attacker can't read other data
- Works across all layers of app

---

### Decision 4: Use Middleware to Auto-Refresh Tokens

**Option A: Manual refresh in components**

```typescript
// ❌ User gets logged out unexpectedly
// ❌ Need to refresh in every component
// ❌ Poor UX
```

**Option B: Middleware auto-refresh** ✅

```typescript
// middleware.ts
// Runs on EVERY request
// Checks if token expired
// Uses refresh_token to get new token
// Updates cookie automatically
// User never notices ✓
```

**Why**:

- Transparent to user (better UX)
- Works everywhere (not just one component)
- Centralized logic (easier to maintain)

---

### Decision 5: Split Supabase Clients (Server vs Client)

**Server Client** (`src/lib/supabase/server.ts`)

```typescript
// Uses ANONYMOUS KEY on server? No, uses session from cookie!
// Session includes user's credentials
// Can securely query database with RLS

// Benefits:
// - Session validated on server
// - Can trust auth.uid() in RLS policies
// - Direct database access
```

**Client Client** (`src/lib/supabase/client.ts`)

```typescript
// Runs in browser
// Uses ANONYMOUS KEY (public, limited permissions)
// For real-time subscriptions
// For client-side state

// Benefits:
// - Can't get server-side data
// - Real-time updates work
// - Safe to expose key
```

**Why split?**

- Server never exposes service key to browser
- Each has appropriate permissions
- Different use cases (data fetching vs real-time)

---

### Decision 6: Use API Routes as Bridge

**Option A: Client directly queries database**

```typescript
// ❌ Can't validate input
// ❌ Can't implement business logic
// ❌ RLS policies only go so far
const { data } = await supabase.from("posts").insert({ title, content }); // Anyone can insert?
```

**Option B: API Route validates, then inserts** ✅

```typescript
// routes/api/posts/create
// 1. Validate input (title length, etc)
// 2. Check rate limit
// 3. Call database
// 4. Return result

// Benefits:
// - Centralized validation
// - Business logic enforcement
// - Rate limiting
// - Logging/monitoring
```

**Why**:

- Application rules live in one place
- Can add validation without changing RLS
- Easier to test

---

## Part 4: Security Layers (Defense in Depth)

```
┌────────────────────────────────────────┐
│  Layer 1: Client Validation            │
│  Email format, password strength       │
│  (User-friendly, not security)         │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Layer 2: Server Validation            │
│  API route checks input again          │
│  (Can't be bypassed by modifying JS)   │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Layer 3: Session Authentication       │
│  Server verifies session token valid   │
│  Token in secure httpOnly cookie       │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Layer 4: Row-Level Security (RLS)     │
│  Database checks user_id matches       │
│  WHERE auth.uid() = user_id            │
│  (Can't be bypassed from app)          │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Layer 5: HTTPS + Cookies              │
│  Encrypted in transit                  │
│  httpOnly (JS can't read)              │
│  sameSite (prevents CSRF)              │
└────────────────────────────────────────┘
```

---

## Part 5: Data Flow Examples

### Example 1: User Signs Up

```
1. User fills form in browser (SignUpForm.tsx)

2. Submit → POST /api/auth/sign-up
   Body: { email: "user@example.com", password: "..." }

3. Server receives request
   - Validates email format
   - Validates password strength
   - Calls supabase.auth.signUp()

4. Supabase Auth (managed service)
   - Hashes password with bcrypt
   - Stores in auth.users table
   - Generates verification token
   - Sends email with verification link

5. Database trigger fires
   - create_profile() function runs
   - Inserts row into profiles table
   - id = user's ID (from auth.users)

6. Response sent to client
   { message: "Check your email" }

7. User clicks email link
   Browser: GET /auth/callback?code=xyz123

8. Server exchanges code for session
   - supabase.auth.exchangeCodeForSession(code)
   - Supabase validates code
   - Returns session (access_token + refresh_token)
   - Server sets secure cookie

9. Browser redirected to /dashboard

10. Dashboard Server Component loads
    - Middleware already refreshed token (on 8)
    - getAuthUser() reads session from cookie
    - Gets user.id
    - getUserProfile(user.id) queries database
    - RLS: WHERE id = auth.uid() (user can see own profile)
    - Returns profile data
    - Server renders page with data

Result: User is authenticated, can see their dashboard ✓
```

### Example 2: Try to Access Someone Else's Data

```
1. Hacker logs in as user@example.com
   Session created ✓

2. Hacker opens DevTools → Network tab
   Modifies request:
   GET /api/posts?user_id=other_user_id

3. API route receives request
   - Reads session from cookie
   - Gets auth.uid() = attacker's user ID

4. Calls: getUserPosts(other_user_id)
   - Database query:
     SELECT * FROM posts WHERE author_id = other_user_id

5. RLS Policy checks:
   CREATE POLICY "Users can view their own posts"
     ON posts FOR SELECT
     USING (auth.uid() = author_id)

   Check: auth.uid() = other_user_id?
   auth.uid() = attacker's ID
   other_user_id = other person's ID
   → NOT EQUAL ✗

6. Database returns: 0 rows
   Attacker gets nothing ✓

Result: RLS prevented data leak, attacker can't access others' data
```

---

## Part 6: Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Check Auth on Server

```typescript
// ❌ BAD
export default async function MyPage() {
  const { data } = await getUserPosts(userId);
  // userId could be anyone's ID from query param!
  return <div>{data}</div>;
}

// ✓ GOOD
export default async function MyPage() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/sign-in");

  const { data } = await getUserPosts(user.id);
  // Only user's own ID used ✓
  return <div>{data}</div>;
}
```

### Pitfall 2: Disabling RLS "for Testing"

```sql
-- ❌ NEVER DISABLED IN PRODUCTION
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- ✓ ALWAYS ENABLED
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Pitfall 3: Exposing Service Key to Client

```typescript
// ❌ NEVER
const client = new SupabaseClient(url, SERVICE_ROLE_KEY);
// This gives attacker ALL permissions!

// ✓ ALWAYS
const client = new SupabaseClient(url, ANON_KEY);
// Limited permissions, RLS enforces what's visible
```

### Pitfall 4: Trusting Client-Side Auth Check

```typescript
// ❌ BAD
"use client";
if (user) {
  return <ProtectedComponent />;
}
// User can modify JS to always show component

// ✓ GOOD (use Server Component)
export default async function ProtectedPage() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/sign-in");
  return <ProtectedComponent />;
}
```

---

## Part 7: When to Use What

### Use Server Components When:

- Need to check authentication (before render)
- Need to fetch user's private data
- Need to perform operations that shouldn't be exposed to client
- Want instant redirect for unauthenticated users

### Use Client Components When:

- Need real-time subscriptions
- Need interactivity (forms, buttons)
- Need client-side state (UI state, not auth)
- Need to listen for auth changes

### Use API Routes When:

- Need to validate complex business logic
- Need to rate limit
- Need to log/monitor actions
- Need to call external services

---

## Part 8: Production Checklist

- [ ] RLS policies enabled on all tables
- [ ] Test that users can't access other users' data
- [ ] Session refresh working (token expires, gets refreshed)
- [ ] Email verification emails have correct link
- [ ] `.env.local` not committed to git
- [ ] Service role key never exposed to client
- [ ] HTTPS enabled (cookies marked secure)
- [ ] CORS configured for allowed domains
- [ ] Supabase backups configured
- [ ] Monitor failed auth attempts

---

## Conclusion

This architecture provides **security through layering**:

1. **Code validation**: Catches user mistakes
2. **Server validation**: Prevents bypasses
3. **Session auth**: Proves identity
4. **RLS policies**: Stops unauthorized queries
5. **HTTPS/Cookies**: Protects in transit

Each layer is independent. If one fails, others prevent damage. This is called **defense in depth**.

The hybrid server/client approach gives you:

- ✅ Security (can't be bypassed)
- ✅ Performance (server caching, instant redirects)
- ✅ UX (seamless token refresh, no auth flashes)
- ✅ Maintainability (centralized logic)

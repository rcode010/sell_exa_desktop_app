# Authentication Bug Report

## What Was Happening

When the app started up, users would see an **"Auth refresh failed"** or **"Session expired"** error pop up even though nothing was actually wrong. The app would sometimes still log you in despite the error, but after refreshing the app you'd get silently kicked out — no message, just back to the login screen.

---

## The Bugs and Their Causes

### Bug 1 — The App Was Calling the Login Check Twice

**What happened:** A pop-up error appeared right on startup even when the user had a valid saved login.

**Why:** React (the UI framework this app uses) has a development mode called "Strict Mode" that intentionally runs startup code **twice** to help catch bugs. Our app's login check (`initAuth`) wasn't protected against this. So it would:

1. Run the first time → grab the saved refresh token → exchange it for a new access token ✅
2. Run the second time immediately after → try to use the **same** old refresh token (which was already used and replaced) → the server rejects it → error toast appears ❌

The root cause is that refresh tokens are **one-time-use** — once exchanged, they're replaced with a new one. The second duplicate call was trying to use the already-consumed token.

**Fix:** Added a simple lock (`isAuthInitializing`) that says "if this startup check is already running, don't start it again." Also added a safety net in the UI layer (`hasInitialized` flag) for extra protection.

---

### Bug 2 — Error Toasts Showed Even When They Shouldn't

**What happened:** Even when `initAuth` was calling the refresh silently in the background (the user shouldn't see anything), error messages were still popping up.

**Why:** The refresh function (`refreshAuth`) had a `silent` mode that was supposed to suppress toasts during background startup. But it only suppressed the *generic* error toast — the "Session expired" toast was still firing unconditionally, even in silent mode.

**Fix:** Moved **all toasts** behind the silent check. When `initAuth` runs on startup, it calls `refreshAuth` in silent mode → no toasts fire whatsoever → if it fails, the router just quietly redirects to the login page on its own.

---

### Bug 3 — "Session Expired" Was Triggered Too Easily

**What happened:** The "Session expired. Please login again." toast was showing up in situations where the session wasn't actually expired.

**Why:** The code was checking `if (error status is 401) → show "session expired"`. But a **401 status code** can happen for many reasons beyond an expired token (network issues, interceptor retries, etc.). This was too broad a check.

**Fix:** Changed it to only show "Session expired" when the **server's actual error message** contains the words "invalid" or "expired" — a much more specific and reliable signal that the token is genuinely no longer valid.

---

### Bug 4 — Logout Toast Fired at Wrong Times

**What happened:** The "Logged out successfully" toast was appearing unexpectedly — sometimes during startup, sometimes after a failed token refresh mid-session — even though the user didn't click logout.

**Why:** When a token refresh failed (either during startup or during a normal API call), the code was calling the full `logout()` function to clean up. That function always shows a "Logged out successfully" toast — even if the logout wasn't intentional.

**Fix:** In situations where we just need to silently clean up auth state (failed refresh, startup failure), we now directly clear the relevant data (`user = null`, `accessToken = null`) without calling `logout()`, so no misleading toast is shown. The real `logout()` is only called when the user explicitly clicks the logout button.

---

## The Result

| Situation | Before | After |
|---|---|---|
| App opens with a saved login | Error toast, visual glitch | Silent load, straight to dashboard |
| Reload after logging in | Kicked back to login silently | Stays logged in, no disruption |
| Refresh token genuinely expired | Random confusing errors | Quietly redirected to login |
| Token expires while using app | "Logged out" toast (confusing) | "Session expired" toast, then login |
| Clicking logout | "Logged out successfully" ✅ | "Logged out successfully" ✅ |

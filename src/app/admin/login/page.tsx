"use client";

import { useEffect, useState, type FormEvent } from "react";
import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";

const SESSION_CONFIRM_ATTEMPTS = 5;
const SESSION_CONFIRM_DELAY_MS = 150;

type SessionCheck = { isAdmin: boolean; email: string | null };

// Reads the current session (if any) and reports both whether it's an
// Admins-group session and, for the "signed in but not authorized" message,
// which account that actually was -- falls back to the Cognito username if
// the email claim isn't present for some reason.
async function checkSession(): Promise<SessionCheck | null> {
  try {
    const session = await fetchAuthSession();
    if (!session.tokens) return null;
    const payload = session.tokens.idToken?.payload;
    const groups = payload?.["cognito:groups"];
    const email =
      (typeof payload?.email === "string" ? payload.email : null) ??
      (typeof payload?.["cognito:username"] === "string"
        ? (payload["cognito:username"] as string)
        : null);
    return { isAdmin: Array.isArray(groups) && groups.includes("Admins"), email };
  } catch {
    return null;
  }
}

// signIn() resolving isSignedIn:true doesn't guarantee the session cookies
// it just wrote are flushed and visible to the very next request yet --
// confirmed via DevTools: the cookies are valid and present, but a
// window.location.href fired immediately after signIn() can still beat
// the write, so middleware.ts's server-side check (reading request
// cookies) sees nothing and bounces back to /admin/login even though the
// session is fine moments later. Briefly re-checking the client-side
// session before navigating closes that gap -- worst case adds well under
// a second. Also doubles as the real "is this account actually an admin"
// check: a correctly-authenticated non-admin account will consistently
// report isAdmin: false across every attempt, not just the first.
async function waitForAdminSession(): Promise<SessionCheck | null> {
  let last: SessionCheck | null = null;
  for (let attempt = 0; attempt < SESSION_CONFIRM_ATTEMPTS; attempt++) {
    last = await checkSession();
    if (last?.isAdmin) return last;
    await new Promise((resolve) => setTimeout(resolve, SESSION_CONFIRM_DELAY_MS));
  }
  return last;
}

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // /admin/login is intentionally excluded from middleware.ts's matcher
  // (so the login form itself is always reachable), which means someone
  // who already has a valid, Admins-group session -- a bookmarked login
  // link, a bounce-back, browser back button -- lands here with nothing
  // redirecting them onward. Checking for that up front and skipping
  // straight to /admin is both a better experience (no form to fill out
  // for someone already signed in) and what prevents the submit handler
  // below from ever hitting Amplify's confusing
  // UserAlreadyAuthenticatedException in the first place.
  const [checkingSession, setCheckingSession] = useState(true);
  // Set when there's a genuinely valid, signed-in session that simply
  // isn't in the Admins group -- shown instead of the form so that case
  // doesn't look like the exact same silent "nothing happens" symptom as
  // the session-race bug this page used to have.
  const [notAuthorizedEmail, setNotAuthorizedEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Loop guard: if the client-side session check below disagrees with
    // middleware.ts's server-side check -- client sees a valid Admins
    // session, server doesn't -- redirecting to /admin just bounces
    // straight back here, which would otherwise retrigger this same
    // effect and loop forever ("just refreshes, nothing works"). This
    // flag means we only ever attempt the automatic redirect once per
    // browser tab between full page loads of this form; if we're back
    // here with the flag already set, something is actually wrong
    // (not just normal navigation) and we fall through to the form
    // instead of trying again.
    const alreadyAttempted = sessionStorage.getItem("admin-login-auto-redirect-attempted");

    (async () => {
      if (!alreadyAttempted) {
        const check = await checkSession();

        if (check?.isAdmin) {
          sessionStorage.setItem("admin-login-auto-redirect-attempted", "1");
          // Full navigation, not client-side routing, so middleware.ts
          // re-runs and the normal /admin auth gate takes it from here.
          window.location.href = "/admin";
          return;
        }

        if (check && !cancelled) {
          // Signed in, but genuinely not an admin -- not a session
          // problem, so don't keep retrying or show the login form. Sign
          // them back out immediately rather than leaving a valid-but-
          // unauthorized session sitting around for a manual click.
          await signOut();
          setNotAuthorizedEmail(check.email);
          sessionStorage.removeItem("admin-login-auto-redirect-attempted");
          setCheckingSession(false);
          return;
        }
      }

      sessionStorage.removeItem("admin-login-auto-redirect-attempted");
      if (!cancelled) setCheckingSession(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleReturnToLogin() {
    // Already signed out at the point this screen was shown -- just go
    // back to the form.
    setNotAuthorizedEmail(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      const result = await signIn({
        username: String(data.get("email")),
        password: String(data.get("password")),
      });

      if (result.isSignedIn) {
        // See waitForAdminSession's comment -- give the session cookies a
        // moment to actually become readable before navigating, instead
        // of racing them. A consistent (not just first-try) isAdmin:false
        // across every attempt means this account really isn't an admin,
        // not a timing issue -- show that instead of bouncing off
        // middleware with no explanation.
        const check = await waitForAdminSession();

        if (!check?.isAdmin) {
          await signOut();
          setNotAuthorizedEmail(check?.email ?? String(data.get("email")));
          setLoading(false);
          return;
        }

        // Full navigation (not client-side routing) so middleware re-runs
        // against the cookies signIn() just wrote.
        window.location.href = "/admin";
        return;
      }

      setError(
        "Additional sign-in steps are required for this account, which this form doesn't support yet.",
      );
    } catch (err) {
      // A harmless race with the already-authenticated check above (the
      // session became valid between mount and submit) -- handle it the
      // same way as a normal sign-in instead of surfacing Amplify's raw
      // "There is already a signed in user." message.
      if (err instanceof Error && err.name === "UserAlreadyAuthenticatedException") {
        const check = await checkSession();
        if (check?.isAdmin) {
          window.location.href = "/admin";
        } else {
          await signOut();
          setNotAuthorizedEmail(check?.email ?? String(data.get("email")));
        }
        return;
      }

      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-brand-navy/60">Checking your session…</p>
      </main>
    );
  }

  if (notAuthorizedEmail) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-brand-navy">Access Not Set Up Yet</h1>
          <p className="mt-3 text-sm text-brand-navy/80">
            You signed in as <strong>{notAuthorizedEmail}</strong>, but that
            account doesn&rsquo;t have admin access to the Pastor4Life
            portal yet.
          </p>
          <p className="mt-3 text-sm text-brand-navy/80">
            Ask your site administrator to add this account to the Admins
            group, then sign in again.
          </p>
          <button
            type="button"
            onClick={handleReturnToLogin}
            className="mt-6 rounded-full bg-brand-navy px-6 py-3 font-medium text-white transition-colors hover:bg-brand-navy/90"
          >
            Return to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-brand-navy">
          Pastor4Life Admin
        </h1>
        <p className="mt-2 text-center text-sm text-brand-navy/70">
          Sign in with your admin account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-navy"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-navy"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-brand-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-brand-navy px-6 py-3 font-medium text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

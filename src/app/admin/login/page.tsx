"use client";

import { useEffect, useState, type FormEvent } from "react";
import { fetchAuthSession, signIn } from "aws-amplify/auth";

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken?.payload["cognito:groups"];
        const isAdmin = Array.isArray(groups) && groups.includes("Admins");

        if (isAdmin) {
          // Full navigation, not client-side routing, so middleware.ts
          // re-runs and the normal /admin auth gate takes it from here.
          window.location.href = "/admin";
          return;
        }
      } catch {
        // No valid session (or the group check failed) -- fall through
        // to showing the login form, same as before.
      }

      if (!cancelled) setCheckingSession(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
      // session became valid between mount and submit) -- treat it the
      // same way: get them into the portal instead of surfacing Amplify's
      // raw "There is already a signed in user." message.
      if (err instanceof Error && err.name === "UserAlreadyAuthenticatedException") {
        window.location.href = "/admin";
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

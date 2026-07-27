"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "aws-amplify/auth";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
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

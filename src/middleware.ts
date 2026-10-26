import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/lib/amplify-server-utils";

// Gates every /admin/* route except /admin/login (see matcher below) on
// Cognito session + Admins group membership. The backend independently
// enforces this too (pray4tn's `before '/admin/*'` filter) — this is about
// UX (don't show the admin UI shell to someone who can't use it), not the
// only line of defense.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // TEMPORARY diagnostic logging -- the login page keeps bouncing back here
  // even after confirming client-side the session is valid and has the
  // Admins claim, which points at a persistent client/server disagreement
  // rather than a transient cookie-write race. Logging exactly what this
  // server-side check sees (or what error it's silently swallowing) until
  // the actual cause is identified; remove once resolved.
  const groups = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        const claim = session.tokens?.idToken?.payload["cognito:groups"];
        console.log(
          "[admin middleware]",
          request.nextUrl.pathname,
          "hasTokens:", !!session.tokens,
          "idToken present:", !!session.tokens?.idToken,
          "groupsClaim:", JSON.stringify(claim),
          "cookieNames:", request.cookies.getAll().map((c) => c.name).join(","),
        );
        return Array.isArray(claim) ? (claim as string[]) : [];
      } catch (err) {
        console.error("[admin middleware] fetchAuthSession threw:", err);
        return [];
      }
    },
  });

  if (!groups.includes("Admins")) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};

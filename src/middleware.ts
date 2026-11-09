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

  const groups = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        const claim = session.tokens?.idToken?.payload["cognito:groups"];
        return Array.isArray(claim) ? (claim as string[]) : [];
      } catch {
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

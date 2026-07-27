import { fetchAuthSession } from "aws-amplify/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Matches the pray4tn auth header contract exactly (WEBSITE_PROJECT_CHECKLIST.md
// Section 3.5) — both headers required, both literally prefixed "Bearer ".
async function authHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const accessToken = session.tokens?.accessToken?.toString();
  const idToken = session.tokens?.idToken?.toString();

  return {
    Authorization: `Bearer ${accessToken}`,
    "X-ID-TOKEN": `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };
}

export class AdminApiError extends Error {}

export async function adminFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let headers: Record<string, string>;
  try {
    headers = await authHeaders();
  } catch (err) {
    console.error("[adminFetch] authHeaders() failed:", err);
    throw err;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
  } catch (err) {
    console.error("[adminFetch] fetch() threw for", path, err);
    throw err;
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof json.errors === "string"
        ? json.errors
        : Array.isArray(json.errors)
          ? json.errors.join(", ")
          : `Request failed: ${res.status}`;
    throw new AdminApiError(message);
  }

  return json.data as T;
}

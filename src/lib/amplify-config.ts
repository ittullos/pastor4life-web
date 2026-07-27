import type { ResourcesConfig } from "aws-amplify";

// Same Cognito user pool the mobile app uses (WEBSITE_PROJECT_CHECKLIST.md
// Section 3.2) — a separate, web-specific App Client (Phase 5), not the
// mobile app's client ID.
export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_WEB_CLIENT_ID!,
    },
  },
};

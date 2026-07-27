import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { amplifyConfig } from "./amplify-config";

// Lets middleware/server components read the current Cognito session from
// request cookies — only works because ConfigureAmplifyClientSide configures
// the client-side Auth category with { ssr: true }, which makes signIn()
// write tokens to cookies instead of localStorage.
export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

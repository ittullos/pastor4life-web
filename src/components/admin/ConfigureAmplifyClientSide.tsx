"use client";

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/lib/amplify-config";

// { ssr: true } is the whole point of this file: it makes the client-side
// Auth category write tokens to cookies instead of localStorage, so
// middleware.ts (running server-side) can read the same session.
Amplify.configure(amplifyConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}

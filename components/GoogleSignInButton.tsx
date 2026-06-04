"use client";

import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

/**
 * Google "Continue with" button. Calls useGoogleLogin internally so the hook
 * only runs when this component is mounted — which the caller should gate on
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID being set. (Without the gate, useGoogleLogin
 * throws "Google OAuth components must be used within GoogleOAuthProvider"
 * because GoogleOAuthProviderWrapper short-circuits when the client ID is
 * missing.)
 */
export function GoogleSignInButton({
  onAccessToken,
  onError,
  disabled,
}: {
  onAccessToken: (token: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}) {
  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: (tokenResponse) => {
      if (!tokenResponse.access_token) {
        onError("Google sign-in returned no access token");
        return;
      }
      onAccessToken(tokenResponse.access_token);
    },
    onError: () => onError("Google sign-in was cancelled or failed"),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled}
      className="w-full py-4 rounded-xl font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
}

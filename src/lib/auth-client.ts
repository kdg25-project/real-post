import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut } = authClient;

export type { Session, User } from "./auth";

export async function signUp(data: {
  email: string;
  password: string;
  accountType: "company" | "user";
  companyName?: string;
}) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Signup failed");
  }

  return response.json();
}

export async function getSessionWithProfile() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch session");
  }

  return response.json();
}
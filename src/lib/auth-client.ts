import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut } = authClient;

export type { Session, User } from "./auth";

type SignUpResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    accountType: "company" | "user";
    createdAt: string;
    updatedAt: string;
  };
};

export async function signUp(data: {
  email: string;
  password: string;
  accountType: "company" | "user";
  country?: string;
}): Promise<SignUpResponse> {
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

  await signIn.email({
    email: data.email,
    password: data.password,
  });

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

export async function updateCompanyProfile(data: {
  companyName?: string;
  companyCategory?: "food" | "culture" | "activity" | "shopping" | "other";
  placeUrl?: string;
  image?: Blob | File;
}) {
  const formData = new FormData();
  if (data.companyName) {
    formData.append("companyName", data.companyName);
  }
  if (data.companyCategory) {
    formData.append("companyCategory", data.companyCategory);
  }
  if (data.placeUrl) {
    formData.append("placeUrl", data.placeUrl);
  }
  if (data.image) {
    formData.append("image", data.image);
  }
  const res = await fetch("/api/company", {
    method: "PATCH",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error(error.error || "Unauthorized");
    }
    throw new Error(error.error || "Failed to update company profile");
  }

  return res.json();
}

export async function createCompanyProfile(data: {
  companyName: string;
  companyCategory: "food" | "culture" | "activity" | "shopping" | "other";
  placeUrl?: string;
  image: Blob | File;
}) {
  const formData = new FormData();
  formData.append("companyName", data.companyName);
  formData.append("companyCategory", data.companyCategory);
  if (data.placeUrl) {
    formData.append("placeUrl", data.placeUrl);
  }
  formData.append("image", data.image);

  const res = await fetch("/api/company", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error(error.error || "Unauthorized");
    }
    throw new Error(error.error || "Failed to create company profile");
  }

  return res.json();
}

export async function updateUserProfile(data: { email?: string; country?: string }) {
  const res = await fetch("/api/auth/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error(error.error || "Unauthorized");
    }
    throw new Error(error.error || "Failed to update user profile");
  }

  return res.json();
}

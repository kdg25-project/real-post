import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  return { error: null, user: session.user };
}

export async function requireAccountType(
  request: NextRequest,
  allowedTypes: ("company" | "user")[]
) {
  const { error, user } = await requireAuth(request);

  if (error) {
    return { error, user: null };
  }

  if (!user?.accountType || !allowedTypes.includes(user.accountType as "company" | "user")) {
    return {
      error: NextResponse.json(
        { error: "Forbidden: Invalid account type" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}

export async function requireCompanyAccount(request: NextRequest) {
  return requireAccountType(request, ["company"]);
}

export async function requireUserAccount(request: NextRequest) {
  return requireAccountType(request, ["user"]);
}

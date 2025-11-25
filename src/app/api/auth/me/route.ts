import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companyProfile, userProfile, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    let profileData = null;

    if (user.accountType === "company") {
      const [company] = await db
        .select()
        .from(companyProfile)
        .where(eq(companyProfile.userId, user.id))
        .limit(1);
      profileData = company;
    } else if (user.accountType === "user") {
      const [profile] = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, user.id))
        .limit(1);
      profileData = profile;
    }

    return NextResponse.json({
      user,
      profile: profileData,
      accountType: user.accountType,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, country } = body;

    if (email) {
      await db.update(user).set({ email }).where(eq(user.id, session.user.id));
    }

    if (country !== undefined && session.user.accountType === "user") {
      await db.update(userProfile).set({ country }).where(eq(userProfile.userId, session.user.id));
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

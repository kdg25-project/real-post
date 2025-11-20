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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const userUpdates: Record<string, unknown> = {};
    if (typeof body.name === "string" && body.name.trim() !== "") {
      userUpdates.name = body.name.trim();
    }
    if (typeof body.image === "string") {
      userUpdates.image = body.image;
    }

    if (session.user.accountType === "company") {
      const profileUpdates: Record<string, unknown> = {};
      if (typeof body.companyName === "string" && body.companyName.trim() !== "") {
        profileUpdates.companyName = body.companyName.trim();
      }

      const allowedCats = [
        "food",
        "culture",
        "activity",
        "shopping",
        "other",
      ];
      if (typeof body.companyCategory === "string") {
        if (!allowedCats.includes(body.companyCategory)) {
          return NextResponse.json(
            { error: "Invalid companyCategory" },
            { status: 400 }
          );
        }
        profileUpdates.companyCategory = body.companyCategory;
      }

      if (Object.keys(userUpdates).length > 0) {
        await db.update(user).set(userUpdates).where(eq(user.id, session.user.id));
      }

      if (Object.keys(profileUpdates).length > 0) {
        await db
          .update(companyProfile)
          .set(profileUpdates)
          .where(eq(companyProfile.userId, session.user.id));
      }
    } else {
      // regular user: allow updating user.name and user.image
      if (Object.keys(userUpdates).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
      }

      await db.update(user).set(userUpdates).where(eq(user.id, session.user.id));
    }

    return NextResponse.json({ message: "Profile updated" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
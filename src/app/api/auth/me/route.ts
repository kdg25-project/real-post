import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companyProfile, userProfile, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadFileToR2 } from "@/lib/r2";

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

    const formData = await request.formData();

    const name = formData.get('name') as string | null;
    const imageFile = formData.get('image') as File | null;

    const userUpdates: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim() !== "") {
      userUpdates.name = name.trim();
    }
    
    // 画像ファイルがアップロードされた場合、R2にアップロード
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadFileToR2(imageFile, 'profiles');
      userUpdates.image = imageUrl;
    }

    if (session.user.accountType === "company") {
      const companyName = formData.get('companyName') as string | null;
      const companyCategory = formData.get('companyCategory') as string | null;

      const profileUpdates: Record<string, unknown> = {};
      if (typeof companyName === "string" && companyName.trim() !== "") {
        profileUpdates.companyName = companyName.trim();
      }

      const allowedCats = [
        "food",
        "culture",
        "activity",
        "shopping",
        "other",
      ];
      if (typeof companyCategory === "string") {
        if (!allowedCats.includes(companyCategory)) {
          return NextResponse.json(
            { error: "Invalid companyCategory" },
            { status: 400 }
          );
        }
        profileUpdates.companyCategory = companyCategory;
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
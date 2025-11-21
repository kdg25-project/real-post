import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { companyProfile } from "@/db/schema";
import { headers } from "next/headers";
import { uploadFileToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireCompanyAccount(request);
    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    // company_profileを登録
    // formDataで受け取る
    const formData = await request.formData();
    const companyName = formData.get("companyName");
    const companyCategory = formData.get("companyCategory");
    const imageFile = formData.get("image");

    let imageUrl: string | null = null;
    if (imageFile && imageFile instanceof File) {
      // R2にアップロード
      imageUrl = await uploadFileToR2("company-profiles", imageFile);
    }

    const [existingProfile] = await db
      .select()
      .from(companyProfile)
      .where(eq(companyProfile.userId, user.id))
      .limit(1);

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Company profile already exists",
          data: null,
        },
        { status: 400 }
      );
    }

    const result = await db
      .insert(companyProfile)
      .values({
        userId: user.id,
        companyName: String(companyName),
        companyCategory: String(companyCategory) as
          | "food"
          | "culture"
          | "activity"
          | "shopping"
          | "other",
        imageUrl: imageUrl,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Company profile created successfully",
        data: result[0],
      }
    );
  } catch (error) {
    console.error("Error creating company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}
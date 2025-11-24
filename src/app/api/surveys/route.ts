import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { survey, surveyImage } from "@/db/schema";
import { getSurveysFromDB } from "@/lib/db/surveys";

type CompanyCategory = "other" | "food" | "culture" | "activity" | "shopping";
type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id ?? null;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const ageGroupParam = searchParams.get("age_group");
    const countryParam = searchParams.get("country");
    const genderParam = searchParams.get("gender");

    const categoryVal = category as CompanyCategory | null;

    // Parse comma-separated values
    const ageGroups = ageGroupParam
      ? (ageGroupParam.split(",").map((s) => s.trim()) as AgeGroup[])
      : null;
    const countries = countryParam
      ? countryParam.split(",").map((s) => s.trim())
      : null;
    const genders = genderParam
      ? (genderParam.split(",").map((s) => s.trim()) as (
          | "male"
          | "female"
          | "other"
        )[])
      : null;

    // Use shared function to get surveys
    const data = await getSurveysFromDB({
      page,
      limit,
      category: categoryVal,
      query,
      ageGroups,
      countries,
      genders,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Surveys fetched",
      data,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch surveys",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // カンパニーユーザーのみがサーベイを作成可能
    if (session.user.accountType !== "company") {
      return NextResponse.json(
        { success: false, message: "Only company accounts can create surveys" },
        { status: 403 },
      );
    }

    // FormDataで受け取る
    const formData = await request.formData();
    const description = formData.get("description");
    const gender = formData.get("gender");
    const ageGroup = formData.get("ageGroup");
    const satisfactionLevel = formData.get("satisfactionLevel");
    const country = formData.get("country");
    const thumbnailFile = formData.get("thumbnail");

    // サムネイル画像をアップロード
    let thumbnailUrl: string | null = null;
    if (thumbnailFile && thumbnailFile instanceof File) {
      const { uploadFileToR2 } = await import("@/lib/r2");
      thumbnailUrl = await uploadFileToR2(thumbnailFile, "surveys");
    }

    // サーベイを作成
    const newSurvey = await db
      .insert(survey)
      .values({
        id: crypto.randomUUID(),
        companyId: session.user.id,
        description: description ? String(description) : null,
        thumbnailUrl: thumbnailUrl,
        gender: gender ? (String(gender) as "male" | "female" | "other") : null,
        ageGroup: ageGroup ? (String(ageGroup) as AgeGroup) : null,
        satisfactionLevel: satisfactionLevel
          ? parseInt(String(satisfactionLevel))
          : null,
        country: country ? String(country) : null,
      })
      .returning();

    // サムネイルを画像としても追加
    if (thumbnailUrl) {
      await db.insert(surveyImage).values({
        id: crypto.randomUUID(),
        surveyId: newSurvey[0].id,
        imageUrl: thumbnailUrl,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Survey created successfully",
        data: newSurvey[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create survey",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

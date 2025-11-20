import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { survey, surveyImage, companyProfile, favorite, user } from "@/db/schema";
import { eq, like, and, inArray, desc } from "drizzle-orm";

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
    const ageGroup = searchParams.get("age_group");
    const country = searchParams.get("country");
    const gender = searchParams.get("gender");

    const categoryVal = category as CompanyCategory | null;

    const offset = (page - 1) * limit;

    // 1) 各companyIdにつき、最新のsurveyを1つ取得
    const latestSurveyIds = await db
      .selectDistinctOn([survey.companyId], {
        id: survey.id,
        companyId: survey.companyId,
        createdAt: survey.createdAt,
      })
      .from(survey)
      .orderBy(survey.companyId, desc(survey.createdAt));

    const latestIds = latestSurveyIds.map((s) => s.id);

    if (latestIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No surveys",
        data: [],
      });
    }

    // 2) surveys を取得(必要なら where 条件を追加)
    const surveys = await db
      .select({
        id: survey.id,
        description: survey.description,
        thumbnailUrl: survey.thumbnailUrl,
        companyId: survey.companyId,
        gender: survey.gender,
        ageGroup: survey.ageGroup,
        satisfactionLevel: survey.satisfactionLevel,
        country: survey.country,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
        companyCategory: companyProfile.companyCategory,
        companyImage: user.image,
      })
      .from(survey)
      .leftJoin(companyProfile, eq(companyProfile.userId, survey.companyId))
      .leftJoin(user, eq(user.id, survey.companyId))
      .where(and(
        inArray(survey.id, latestIds),
        categoryVal ? eq(companyProfile.companyCategory, categoryVal) : undefined,
        query ? like(survey.description, `%${query}%`) : undefined,
        ageGroup ? eq(survey.ageGroup, ageGroup as AgeGroup) : undefined,
        country ? eq(survey.country, country) : undefined,
        gender ? eq(survey.gender, gender as "male" | "female" | "other") : undefined
      ))
      .limit(limit)
      .offset(offset);

    // 3) 画像をまとめて取得
    const surveyIds = surveys.map((s) => s.id);
    const images = await db
      .select({
        surveyId: surveyImage.surveyId,
        url: surveyImage.imageUrl,
      })
      .from(surveyImage)
      .where(inArray(surveyImage.surveyId, surveyIds));
    
    const imagesBySurvey = images.reduce<Record<string, string[]>>((acc, cur) => {
      const key = String(cur.surveyId);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(cur.url);
      return acc;
    }, {});

    // 3) ログインしていれば favorites を取得して存在判定
    const favoriteSet = new Set<string>();
    if (userId) {
      const favs = await db
        .select({ surveyId: favorite.surveyId })
        .from(favorite)
        .where(and(eq(favorite.userId, userId), inArray(favorite.surveyId, surveyIds)));

      favs.forEach((f) => favoriteSet.add(String(f.surveyId)));
    }

    // 4) レスポンス整形
    const data = surveys.map((s) => ({
      id: String(s.id),
      description: s.description ?? "",
      thumbnailUrl: s.thumbnailUrl ?? s.companyImage ?? null,
      imageUrls: imagesBySurvey[String(s.id)] ?? [],
      gender: s.gender ?? null,
      ageGroup: s.ageGroup ?? null,
      satisfactionLevel: s.satisfactionLevel ?? 0,
      country: s.country ?? "",
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
      updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
      isFavorite: userId ? favoriteSet.has(String(s.id)) : null,
      companyCategory: (s.companyCategory as CompanyCategory) ?? "other",
    }));

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
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
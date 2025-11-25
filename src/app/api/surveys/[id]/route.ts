import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { survey, user, favorite, companyProfile } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // セッション情報を取得
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id ?? null;

    const result = await db
      .select({
        id: survey.id,
        companyId: survey.companyId,
        description: survey.description,
        thumbnailUrl: survey.thumbnailUrl,
        gender: survey.gender,
        ageGroup: survey.ageGroup,
        satisfactionLevel: survey.satisfactionLevel,
        country: survey.country,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
        companyImage: user.image,
        companyName: companyProfile.companyName,
        companyCategory: companyProfile.companyCategory,
        favoriteCount: sql<number>`count(${favorite.id})`.mapWith(Number),
      })
      .from(survey)
      .leftJoin(user, eq(user.id, survey.companyId))
      .leftJoin(companyProfile, eq(companyProfile.userId, survey.companyId))
      .leftJoin(favorite, eq(favorite.surveyId, survey.id))
      .where(eq(survey.id, id))
      .groupBy(survey.id, user.image, companyProfile.companyName, companyProfile.companyCategory)
      .then((res) => res);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Survey not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const surveyData = result[0];
    const { companyImage, ...responseData } = surveyData;

    // ログインユーザーのお気に入り状態を確認
    let isFavorited: boolean | null = null;
    if (userId) {
      const favoriteRecord = await db
        .select({ id: favorite.id })
        .from(favorite)
        .where(and(eq(favorite.userId, userId), eq(favorite.surveyId, id)))
        .limit(1);
      isFavorited = favoriteRecord.length > 0;
    }

    return NextResponse.json({
      success: true,
      message: "Survey fetched successfully",
      data: {
        ...responseData,
        thumbnailUrl: surveyData.thumbnailUrl ?? companyImage ?? null,
        isFavorited,
      },
    });
  } catch (error) {
    console.error("Error fetching survey by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch surveys",
        data: null,
      },
      { status: 500 }
    );
  }
}

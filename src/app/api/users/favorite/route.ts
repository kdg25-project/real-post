import { NextRequest, NextResponse} from "next/server";
import { db } from "@/db";
import { favorite, survey, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireUserAccount } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const { error, user: currentUser } = await requireUserAccount(request);
    if (error || !currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    const result = await db
      .select({
        id: favorite.id,
        userId: favorite.userId,
        surveyId: favorite.surveyId,
        createdAt: favorite.createdAt,
        updatedAt: favorite.updatedAt,
        survey: {
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
          favoriteCount: sql<number>`(select count(*) from ${favorite} where ${favorite.surveyId} = ${survey.id})`.mapWith(Number),
        },
      })
      .from(favorite)
      .leftJoin(survey, eq(survey.id, favorite.surveyId))
      .leftJoin(user, eq(user.id, survey.companyId))
      .where(eq(favorite.userId, currentUser.id))
      .then((res) => res);

    const favoritesWithFallback = result.map((f) => ({
      id: f.id,
      userId: f.userId,
      surveyId: f.surveyId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      survey: f.survey ? {
        id: f.survey.id,
        companyId: f.survey.companyId,
        description: f.survey.description,
        thumbnailUrl: f.survey.thumbnailUrl ?? f.survey.companyImage ?? null,
        gender: f.survey.gender,
        ageGroup: f.survey.ageGroup,
        satisfactionLevel: f.survey.satisfactionLevel,
        country: f.survey.country,
        createdAt: f.survey.createdAt,
        updatedAt: f.survey.updatedAt,
        favoriteCount: f.survey.favoriteCount,
      } : null,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Favorites fetched successfully",
        data: favoritesWithFallback,
      }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch favorites",
        data: null,
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { survey, user, favorite, companyProfile } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

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
      favoriteCount: sql<number>`count(${favorite.id})`.mapWith(Number),
      isFavorited: sql<boolean>`bool_or(${favorite.id} IS NOT NULL)`,
    })
    .from(survey)
    .leftJoin(user, eq(user.id, survey.companyId))
    .leftJoin(companyProfile, eq(companyProfile.userId, survey.companyId))
    .leftJoin(favorite, eq(favorite.surveyId, survey.id))
    .where(eq(survey.id, id))
    .groupBy(survey.id, user.image, companyProfile.companyName)
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
  
  return NextResponse.json(
    {
      success: true,
      message: "Survey fetched successfully",
      data: {
        ...responseData,
        thumbnailUrl: surveyData.thumbnailUrl ?? companyImage ?? null,
      },
    }
  );
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
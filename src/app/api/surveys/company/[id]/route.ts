import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { survey } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkSurveyTokenValidity, decrementSurveyTokenCount } from '@/lib/survey-middleware';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type Props = {
  description: string;
  thumbnailUrl?: string;
  imageUrls?: Array<string>;
  gender: "male" | "female" | "other" | null;
  ageGroup: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
  satisfactionLevel: number; // 1から5を想定
  country: string;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

  const result = await db
    .select()
    .from(survey)
    .where(eq(survey.companyId, id))
    .then((res) => res);

  return NextResponse.json(
    {
      success: true,
      message: "Surveys fetched successfully",
      data: result,
    }
  );
  } catch (error) {
    console.error("Error fetching surveys by company ID:", error);
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

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing or invalid token",
          data: null,
        },
        { status: 401 }
      );
    }

    const { error, isValid } = await checkSurveyTokenValidity(request, (await params).id);
    if (error) {
      return error;
    }
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Survey token expired",
          data: null,
        },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body: Props = await request.json();
    if (!body.description ||  body.satisfactionLevel === undefined || !body.country) {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request: Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }

    const insertData = {
      ...body,
      companyId: id,
      id: crypto.randomUUID(),
    };

    await db.insert(survey).values(insertData);

    await decrementSurveyTokenCount(request);
    return NextResponse.json(
      {
        success: true,
        message: "Survey created successfully",
        data: insertData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create survey",
        data: null,
      },
      { status: 500 }
    );
  }
}
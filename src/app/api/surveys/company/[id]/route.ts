import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { survey, surveyImage } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkSurveyTokenValidity, decrementSurveyTokenCount } from '@/lib/survey-middleware';
import { uploadFileToR2 } from '@/lib/r2';

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
    const formData = await request.formData();
    
    const description = formData.get('description') as string;
    const gender = formData.get('gender') as "male" | "female" | "other" | null;
    const ageGroup = formData.get('ageGroup') as "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
    const satisfactionLevel = parseInt(formData.get('satisfactionLevel') as string);
    const country = formData.get('country') as string;
    const thumbnail = formData.get('thumbnail') as File | null;
    const images = formData.getAll('images') as File[];

    if (!description || isNaN(satisfactionLevel) || !country) {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request: Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }

    // サムネイルをR2にアップロード
    let thumbnailUrl: string | null = null;
    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await uploadFileToR2(thumbnail, 'surveys/thumbnails');
    }

    // サーベイデータを作成
    const surveyId = crypto.randomUUID();
    const insertData = {
      id: surveyId,
      companyId: id,
      description,
      thumbnailUrl,
      gender,
      ageGroup,
      satisfactionLevel,
      country,
    };

    await db.insert(survey).values(insertData);

    // 追加画像をR2にアップロードしてsurveyImageテーブルに保存
    if (images && images.length > 0) {
      const imageUploads = images.filter(img => img.size > 0).map(async (image) => {
        const imageUrl = await uploadFileToR2(image, 'surveys/images');
        return {
          id: crypto.randomUUID(),
          surveyId,
          imageUrl,
        };
      });

      const imageRecords = await Promise.all(imageUploads);
      if (imageRecords.length > 0) {
        await db.insert(surveyImage).values(imageRecords);
      }
    }

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
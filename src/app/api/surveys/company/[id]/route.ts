import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { survey } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
      "success": true,
      "message": "Surveys fetched successfully",
      "data": result,
    }
  );
  } catch (error) {
    console.error("Error fetching surveys by company ID:", error);
    return NextResponse.json(
      {
        "success": false,
        "message": "Failed to fetch surveys",
        "data": null,
      },
      { status: 500 }
    );
  }
}

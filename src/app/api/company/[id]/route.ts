import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { companyProfile, user } from "@/db/schema";

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
        id: companyProfile.id,
        userId: companyProfile.userId,
        companyName: companyProfile.companyName,
        companyCategory: companyProfile.companyCategory,
        image: user.image,
        placeId: companyProfile.placeId,
        createdAt: companyProfile.createdAt,
        updatedAt: companyProfile.updatedAt,
      })
      .from(companyProfile)
      .leftJoin(user, eq(user.id, companyProfile.userId))
      .where(eq(companyProfile.userId, id))
      .then((res) => res);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Company profile not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const companyData = result[0];

    return NextResponse.json(
      {
        success: true,
        message: "Company profile fetched successfully",
        data: companyData,
      }
    );
  } catch (error) {
    console.error("Error fetching company profile by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}
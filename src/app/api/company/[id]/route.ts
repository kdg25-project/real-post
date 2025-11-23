import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { companyProfile, user, goods, goodsImage } from "@/db/schema";

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
        imageUrl: companyProfile.imageUrl,
        placeId: companyProfile.placeId,
        createdAt: companyProfile.createdAt,
        updatedAt: companyProfile.updatedAt,
        goodsId: goods.id,
        goodsName: goods.name,
        goodsImageUrl: goodsImage.imageUrl,
      })
      .from(companyProfile)
      .leftJoin(user, eq(user.id, companyProfile.userId))
      .leftJoin(goods, eq(goods.companyId, companyProfile.userId))
      .leftJoin(goodsImage, eq(goodsImage.goodsId, goods.id))
      .where(eq(companyProfile.userId, id))
      .orderBy(desc(goodsImage.createdAt))
      .limit(1)
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

    const row = result[0];

    const companyData = {
      id: row.id,
      userId: row.userId,
      companyName: row.companyName,
      companyCategory: row.companyCategory,
      imageUrl: row.imageUrl,
      placeId: row.placeId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      goods: row.goodsId
        ? {
            id: row.goodsId,
            name: row.goodsName,
            imageUrl: row.goodsImageUrl,
          }
        : null,
    };

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
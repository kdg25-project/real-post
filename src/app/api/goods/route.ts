import { db } from "@/db";
import { goods, goodsImage } from "@/db/schema";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  getPaginationParams,
  getGoodsCount,
  handleGoodsError,
  goodsFormDataSchema,
  uploadGoodsImages,
} from "./utils";
import type { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize } = getPaginationParams(searchParams);

    const [allGoods, totalCount] = await Promise.all([
      db.query.goods.findMany({
        with: { images: true },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      getGoodsCount(),
    ]);

    return NextResponse.json<ApiResponse<typeof allGoods>>({
      success: true,
      message: "Goods fetched successfully",
      data: allGoods,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    return handleGoodsError(error, "Failed to fetch goods");
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireCompanyAccount(req);
  if (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message: "User is not authenticated or does not have a company account",
      },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();
    const validatedData = goodsFormDataSchema.parse({
      name: formData.get("name"),
      images: formData.getAll("images"),
    });

    const goodsId = crypto.randomUUID();
    const imageUrls = await uploadGoodsImages(validatedData.images);

    const newGoodsImages = imageUrls.map((url) => ({
      id: crypto.randomUUID(),
      goodsId,
      imageUrl: url,
    }));

    await db.transaction(async (tx) => {
      await tx.insert(goods).values({
        id: goodsId,
        companyId: user.id,
        name: validatedData.name,
      });
      await tx.insert(goodsImage).values(newGoodsImages);
    });

    return NextResponse.json<
      ApiResponse<{ id: string; name: string; image_urls: string[] }>
    >({
      success: true,
      message: "Goods created successfully",
      data: {
        id: goodsId,
        name: validatedData.name,
        image_urls: imageUrls,
      },
    });
  } catch (error) {
    return handleGoodsError(error, "Failed to create goods");
  }
}

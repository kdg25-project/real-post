import { db } from "@/db";
import { goods, goodsImage } from "@/db/schema";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { uploadFileToR2 } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const pageScheme = z.coerce.number().min(1).default(1);
  const limitScheme = z.coerce.number().min(1).max(100).default(10);

  try {
    const { searchParams } = new URL(req.url);
    const page = pageScheme.parse(searchParams.get("page") ?? undefined);
    const pageSize = limitScheme.parse(searchParams.get("limit") ?? undefined);
    const [allGoods, totalCount] = await Promise.all([
      db.query.goods.findMany({
        with: { images: true },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: sql`count(*)` }).from(goods),
    ]);
    const count = Number(totalCount[0].count);
    return NextResponse.json({
      success: true,
      message: "Goods fetched successfully",
      data: allGoods,
      pagination: {
        page,
        pageSize,
        totalCount: count,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: error.issues,
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to fetch goods",
        },
        { status: 500 },
      );
    }
  }
}

export async function POST(req: NextRequest) {
  const formDataSchema = z.object({
    name: z
      .string()
      .min(1, "名前は必須です。")
      .max(50, "名前は50文字までです。"),
    images: z
      .instanceof(Blob)
      .refine((blob) => {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/avif",
        ];
        return validTypes.includes(blob.type);
      }, "画像はJPEG、JPG、PNG、WEBP、AVIF形式である必要があります。")
      .array()
      .min(1, "画像は最低1枚必要です。")
      .max(5, "画像は最大5枚までです。"),
  });
  const { error, user } = await requireCompanyAccount(req);
  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "User is not authenticated or does not have a company account",
      },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const images = formData.getAll("images");

    const validatedData = formDataSchema.parse({
      name,
      images,
    });

    const goodsId = crypto.randomUUID();

    const imageUrls: Array<string> = [];

    for (const image of validatedData.images) {
      if (image instanceof File) {
        const imageUrl = await uploadFileToR2(image, "goods-images");
        imageUrls.push(imageUrl);
      }
    }

    const newGoodsImages = imageUrls.map((url) => ({
      id: crypto.randomUUID(),
      goodsId: goodsId,
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

    return NextResponse.json({
      success: true,
      message: "Goods created successfully",
      data: {
        id: goodsId,
        name: validatedData.name,
        image_urls: imageUrls,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data",
          errors: error.issues,
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to create goods",
        },
        { status: 500 },
      );
    }
  }
}

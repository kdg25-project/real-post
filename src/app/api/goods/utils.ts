import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { goods } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { uploadFileToR2 } from "@/lib/r2";

// ================== スキーマ定義 ==================
export const pageSchema = z.coerce.number().min(1).default(1);
export const limitSchema = z.coerce.number().min(1).max(100).default(10);

export const goodsFormDataSchema = z.object({
  name: z.string().min(1, "名前は必須です。").max(50, "名前は50文字までです。"),
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

// ================== ユーティリティ関数 ==================

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = pageSchema.parse(searchParams.get("page") ?? undefined);
  const pageSize = limitSchema.parse(searchParams.get("limit") ?? undefined);
  return { page, pageSize };
}

// 商品の総数を取得（会社IDでフィルタ可能）
export async function getGoodsCount(companyId?: string) {
  if (companyId) {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(goods)
      .where(eq(goods.companyId, companyId));
    return Number(result[0].count);
  }
  const result = await db.select({ count: sql`count(*)` }).from(goods);
  return Number(result[0].count);
}

export async function uploadGoodsImages(images: Blob[]): Promise<string[]> {
  const imageUrls: string[] = [];
  for (const image of images) {
    if (image instanceof File) {
      const imageUrl = await uploadFileToR2(image, "goods-images");
      imageUrls.push(imageUrl);
    }
  }
  return imageUrls;
}

// ================== エラーハンドリング ==================
export function handleGoodsError(error: unknown, defaultMessage: string) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid parameters",
        errors: error.issues,
      },
      { status: 400 },
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : defaultMessage,
    },
    { status: 500 },
  );
}

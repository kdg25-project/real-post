import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { goods } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { uploadFileToR2 } from "@/lib/r2";
import type { ApiResponse } from "@/types";

// ================== スキーマ定義 ==================
export const pageSchema = z.coerce.number().min(1, "pageを1以上の値にしてください。").default(1);
export const limitSchema = z.coerce
  .number()
  .min(1, "最低1件は取得する必要があります。")
  .max(100, "最大100件まで取得可能です。")
  .default(10);

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
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message: "Invalid parameters",
        errors: error.issues,
      },
      { status: 400 }
    );
  }
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      message: error instanceof Error ? error.message : defaultMessage,
    },
    { status: 500 }
  );
}

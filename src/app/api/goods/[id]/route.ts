import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { goods, goodsImage } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { handleGoodsError, uploadGoodsImages } from "../utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const goodsfromid = await db.query.goods.findFirst({
      with: {
        images: true,
      },
      where: (table, { eq }) => eq(table.id, id),
    });
    if (!goodsfromid) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          message: "Goods Not Found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json<ApiResponse<typeof goodsfromid>>({
      success: true,
      message: "Goods fetched successfully",
      data: goodsfromid,
    });
  } catch (error) {
    return handleGoodsError(error, "Failed to fetch goods");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const goodsFormDataSchema = z.object({
    name: z
      .string()
      .min(1, "名前は必須です。")
      .max(50, "名前は50文字までです。")
      .optional(),
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
      .max(5, "画像は最大5枚までです。")
      .optional(),
    deleteImageIds: z.string().array().optional(),
  });
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
      deleteImageIds: formData.getAll("deleteImageIds"),
    });
    const existingGoods = await db.query.goods.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    if (!existingGoods) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          message: "Goods Not Found",
        },
        { status: 404 },
      );
    }

    let imageUrls: string[] = [];
    if (validatedData.images) {
      imageUrls = await uploadGoodsImages(validatedData.images);
    }

    await db.transaction(async (tx) => {
      if (validatedData.name) {
        await tx
          .update(goods)
          .set({
            name: validatedData.name,
          })
          .where(eq(goods.id, id));
      }
      if (validatedData.deleteImageIds) {
        await Promise.all(
          validatedData.deleteImageIds.map((imageId) =>
            tx.delete(goodsImage).where(eq(goodsImage.id, imageId)),
          ),
        );
      }
      if (imageUrls.length > 0) {
        const newGoodsImages = imageUrls.map((url) => ({
          id: crypto.randomUUID(),
          goodsId: id,
          imageUrl: url,
        }));
        await tx.insert(goodsImage).values(newGoodsImages);
      }
    });

    const updatedGoods = await db.query.goods.findFirst({
      with: {
        images: true,
      },
      where: (table, { eq }) => eq(table.id, id),
    });

    return NextResponse.json<ApiResponse<typeof updatedGoods>>({
      success: true,
      message: "Goods updated successfully",
      data: updatedGoods,
    });
  } catch (error) {
    return handleGoodsError(error, "Failed to update goods");
  }
}

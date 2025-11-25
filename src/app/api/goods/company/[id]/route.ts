import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { getGoodsCount, getPaginationParams, handleGoodsError } from "../../utils";
import type { ApiResponse } from "@/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize } = getPaginationParams(searchParams);

    const [goodsfromid, totalCount] = await Promise.all([
      db.query.goods.findMany({
        with: { images: true },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: (table, { eq }) => eq(table.companyId, id),
      }),
      getGoodsCount(id),
    ]);
    return NextResponse.json<ApiResponse<typeof goodsfromid>>({
      success: true,
      message: "Goods fetched successfully",
      data: goodsfromid,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    return handleGoodsError(error, "Failed to fetch goods from companyId");
  }
}

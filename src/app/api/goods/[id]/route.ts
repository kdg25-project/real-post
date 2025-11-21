import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

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
          message: "Not Found",
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
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch goods",
      },
      { status: 500 },
    );
  }
}

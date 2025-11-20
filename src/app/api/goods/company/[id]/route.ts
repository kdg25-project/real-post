import { db } from "@/db";
import { goods } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("limit") || "10");
    const [goodsfromid, totalCount] = await Promise.all([
      db.query.goods.findMany({
        with: { images: true },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: (table, { eq }) => eq(table.companyId, id),
      }),
      db.select({ count: sql`count(*)` }).from(goods),
    ]);
    const count = Number(totalCount[0].count);
    if (goodsfromid.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Goods fetched successfully",
      data: goodsfromid,
      pagination: {
        page,
        pageSize,
        totalCount: count,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
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

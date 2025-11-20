import { db } from "@/db";
import { goods } from "@/db/schema";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("limit") || "10");
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

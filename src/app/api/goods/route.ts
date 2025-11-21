import { db } from "@/db";
import { goods } from "@/db/schema";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";

const pageScheme = z.coerce.number().min(1).default(1);
const limitScheme = z.coerce.number().min(1).max(100).default(10);

export async function GET(req: NextRequest) {
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
  type Body = {
    name: string;
    images: Array<Blob>;
  };
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
  const body: Body = await req.json();
  const res = await db.insert(goods).values({
    id: crypto.randomUUID(),
    companyId: user.id,
    name: body.name,
  });
  return NextResponse.json({
    success: true,
    message: "Goods created successfully",
    data: res,
  });
}

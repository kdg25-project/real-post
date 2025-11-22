import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { goods, companies } from "@/db/schema";
import { validateCompanyVerification, CompanyNotFoundError } from "@/lib/validations/company";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, companyId } = body;

    // Validate required fields
    if (!name || !price || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, and companyId are required" },
        { status: 400 }
      );
    }

    // Validate company verification
    const isVerified = await validateCompanyVerification(companyId);
    
    if (!isVerified) {
      return NextResponse.json(
        { error: "Company must be verified before creating goods" },
        { status: 403 }
      );
    }

    // Create the goods
    const newGoods = await db
      .insert(goods)
      .values({
        name,
        description: description || null,
        price,
        companyId,
      })
      .returning();

    return NextResponse.json(
      { data: newGoods[0], message: "Goods created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("companyId");

    const baseQuery = db.select({
      goods: goods,
      company: {
        id: companies.id,
        name: companies.name,
        verified: companies.verified,
      },
    }).from(goods).innerJoin(companies, eq(goods.companyId, companies.id));

    const allGoods = companyId
      ? await baseQuery.where(eq(goods.companyId, companyId))
      : await baseQuery;

    return NextResponse.json(
      { data: allGoods },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

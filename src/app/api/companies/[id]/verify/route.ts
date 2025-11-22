import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { verified } = body;

    if (typeof verified !== "boolean") {
      return NextResponse.json(
        { error: "verified field must be a boolean" },
        { status: 400 }
      );
    }

    // Update the company verification status
    const updatedCompany = await db
      .update(companies)
      .set({ 
        verified,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();

    if (updatedCompany.length === 0) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        data: updatedCompany[0], 
        message: `Company verification status updated to ${verified}` 
      },
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

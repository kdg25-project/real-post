import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, verified = false } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: name and email are required" },
        { status: 400 }
      );
    }

    // Create the company
    const newCompany = await db
      .insert(companies)
      .values({
        name,
        email,
        verified,
      })
      .returning();

    return NextResponse.json(
      { data: newCompany[0], message: "Company created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      // Handle unique constraint violation for email
      if (error.message.includes("unique")) {
        return NextResponse.json(
          { error: "Company with this email already exists" },
          { status: 409 }
        );
      }
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

export async function GET() {
  try {
    const allCompanies = await db.select().from(companies);

    return NextResponse.json(
      { data: allCompanies },
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

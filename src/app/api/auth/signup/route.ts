import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companyProfile, userProfile } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password, accountType, companyName, companyCategory } = body;

    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: "Email, password, and account type are required" },
        { status: 400 }
      );
    }

    if (!["company", "user"].includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    if (accountType === "company" && (!companyName || !companyCategory)) {
      return NextResponse.json(
        { error: "Company name and category are required for company accounts" },
        { status: 400 }
      );
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: accountType === "company" ? (companyName || email) : email,
        accountType,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    try {
      if (accountType === "company" && companyName && companyCategory) {
        await db.insert(companyProfile).values({
          id: crypto.randomUUID(),
          userId: signUpResult.user.id,
          companyName,
          companyCategory: companyCategory as "food" | "culture" | "activity" | "shopping" | "other",
        });
      } else {
        await db.insert(userProfile).values({
          id: crypto.randomUUID(),
          userId: signUpResult.user.id,
        });
      }
    } catch (profileError) {
      console.error("Profile creation error:", profileError);
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: signUpResult.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

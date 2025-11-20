import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companyProfile, userProfile } from "@/db/schema";
import { uploadFileToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const accountType = formData.get('accountType') as string;
    const companyName = formData.get('companyName') as string | null;
    const companyCategory = formData.get('companyCategory') as string | null;
    const imageFile = formData.get('image') as File | null;

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

    if (accountType === "company" && (!companyName || !companyCategory || !imageFile)) {
      return NextResponse.json (
        { error: "Company name, category, and image are required for company accounts" },
        { status: 400 }
      );
    }

    // 画像をR2にアップロード
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToR2(imageFile, 'profiles');
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: accountType === "company" ? (companyName || email) : email,
        accountType,
        image: imageUrl || undefined,
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

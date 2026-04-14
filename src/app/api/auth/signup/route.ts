import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userProfile } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password, accountType, country } = body;

    // バリデーションエラー
    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: "Email, password, and account type are required" },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // パスワードの長さチェック
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // アカウントタイプのバリデーション
    if (!["company", "user"].includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type. Must be 'company' or 'user'" },
        { status: 400 }
      );
    }

    let signUpResult;
    try {
      signUpResult = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: email,
          accountType,
        },
      });
    } catch (authError) {
      // 認証関連のエラー処理
      const errorMessage = authError instanceof Error ? authError.message : String(authError);
      if (errorMessage.includes("duplicate") || errorMessage.includes("unique") || errorMessage.includes("already exists")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      if (errorMessage.includes("invalid") || errorMessage.includes("validation")) {
        return NextResponse.json(
          { error: errorMessage || "Invalid input data" },
          { status: 400 }
        );
      }
      throw authError;
    }

    if (!signUpResult || !signUpResult.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // 一般ユーザーの場合のみuserProfileを作成
    try {
      if (accountType === "user") {
        await db.insert(userProfile).values({
          id: crypto.randomUUID(),
          userId: signUpResult.user.id,
          country: country || null,
        });
      }
      // カンパニーの場合は、/api/company POSTで別途作成する
    } catch (profileError) {
      console.error("Profile creation error:", profileError);
    }

    return NextResponse.json(
      {
        success: true,
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

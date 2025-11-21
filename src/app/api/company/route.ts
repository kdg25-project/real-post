import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { companyProfile } from "@/db/schema";
import { headers } from "next/headers";
import { uploadFileToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireCompanyAccount(request);
    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    // company_profileを登録
    // formDataで受け取る
    const formData = await request.formData();
    const companyName = formData.get("companyName");
    const companyCategory = formData.get("companyCategory");
    const imageFile = formData.get("image");
  } catch (error) {
    console.error("Error creating company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}
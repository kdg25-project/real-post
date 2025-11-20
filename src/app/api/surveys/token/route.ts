import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { authSurveyToken, generateSurveyToken } from "@/lib/survey-middleware";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const companyId = session?.user?.id;
    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized: Missing company account" }, { status: 401 });
    }

    const { maxUses } = await request.json();
    const token = await generateSurveyToken(companyId, maxUses);

    return NextResponse.json(
      {
        success: true,
        message: "Survey token generated successfully",
        data: { token },
      }
    );
  } catch (error) {
    console.error("Error generating survey token:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate survey token",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
      const header = request.headers.get("Authorization");
      if (!header) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized: Missing survey token",
            data: null,
          },
          { status: 401 }
        );
      }

    const companyId = request.nextUrl.searchParams.get("company_id");
      if (!companyId) {
        return NextResponse.json(
          {
            success: false,
            message: "Bad Request: Missing company ID",
            data: null,
          },
          { status: 400 }
        );
      }

      const { error, survey } = await authSurveyToken(request, companyId);
      if (error) {
        return error;
      }

      if (!survey || survey.remainingCount <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired survey token",
            data: null,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Survey token is valid",
          data: {
            isValid: survey.expiredAt < new Date() || survey.remainingCount <= 0 ? false : true,
          },
        }
      );
  } catch (error) {
    console.error("Error validating survey token:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to validate survey token",
        data: null,
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse} from "next/server";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { requireUserAccount } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requireUserAccount(request);
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

    const result = await db
      .select()
      .from(favorite)
      .where(eq(favorite.userId, user.id))
      .then((res) => res);

    return NextResponse.json(
      {
        success: true,
        message: "Favorites fetched successfully",
        data: result,
      }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch favorites",
        data: null,
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { requireUserAccount } from "@/lib/auth-middleware";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await db
      .select()
      .from(favorite)
      .where(eq(favorite.surveyId, id))
      .then((res) => res);

    return NextResponse.json(
      {
        success: true,
        message: "Favorites fetched successfully",
        data: result,
      }
    );
  } catch (error) {
    console.error("Error fetching favorites by survey ID:", error);
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

export async function PATCH(request: NextRequest, { params }: Params) {
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
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing user session",
          data: null,
        },
        { status: 401 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const { isFavorited } = body;
    let result;

    if(isFavorited !== undefined) {
      if (isFavorited) {
        result = await db.insert(favorite).values({
          id: crypto.randomUUID(),
          userId,
          surveyId: id,
        })
        .then((res) => res);
      } else {
        result = await db
          .delete(favorite)
          .where(and(
            eq(favorite.userId, userId),
            eq(favorite.surveyId, id)
          ))
          .then((res) => res);
      }
    } else {
      const result1 = await db
        .select()
        .from(favorite)
        .where(and(
          eq(favorite.userId, userId),
          eq(favorite.surveyId, id)
        ))
        .then((res) => res);
      if (result1.length > 0) {
        result = await db
          .delete(favorite)
          .where(eq(favorite.id, result1[0].id))
          .then((res) => res);
      } else {
        result = await db
          .insert(favorite).values({
            id: crypto.randomUUID(),
            userId,
            surveyId: id,
          })
          .then((res) => res);
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "Favorite status toggled successfully",
        data: result,
      }
    );

} catch (error) {
    console.error("Error toggling favorite status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to toggle favorite status",
        data: null,
      },
      { status: 500 }
    );
  }
}
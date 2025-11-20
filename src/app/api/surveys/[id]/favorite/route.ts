import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
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
    const { isFavorite } = await request.json();
    let result;

    if(!isFavorite === undefined) {
      if (isFavorite) {
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
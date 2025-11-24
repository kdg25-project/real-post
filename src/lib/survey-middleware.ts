import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
import { surveyToken as surveyTable } from "@/db/schema";
import { eq, and, sql, gt } from "drizzle-orm";

export async function generateSurveyToken(companyId: string, maxUses: number) {
  // シンプルなランダム英数字文字列を生成（URLセーフ）
  const tokenHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(36))
    .join('')
    .substring(0, 64);
  
  const tokenId = crypto.randomUUID();
  await db
    .insert(surveyTable)
    .values({
      id: tokenId,
      companyId,
      token: tokenHash,
      remainingCount: maxUses,
    });

  console.log("Generated token hash:", tokenHash.substring(0, 20) + "...");
  console.log("Token length:", tokenHash.length);
  return tokenHash;
}

export async function authSurveyToken(request: NextRequest, companyId: string) {
  const tokenHash = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!tokenHash) {
    return {
      error: "Unauthorized: Missing survey token",
      survey: null,
    };
  }

  console.log("Received token:", tokenHash.substring(0, 20) + "...");
  console.log("Token length:", tokenHash.length);

  console.log("Looking for survey with companyId:", companyId, "tokenHash:", tokenHash.substring(0, 20) + "...");

  const survey = await db
    .select()
    .from(surveyTable)
    .where(and(eq(surveyTable.companyId, companyId), eq(surveyTable.token, tokenHash)))
    .limit(1)
    .then((res) => res[0]);

  if (!survey) {
    console.error("Survey not found for companyId:", companyId);
    return {
      error: "Unauthorized: Invalid survey token",
      survey: null,
    };
  }

  console.log("Survey found:", {
    id: survey.id,
    expiredAt: survey.expiredAt,
    remainingCount: survey.remainingCount,
    now: new Date()
  });

  if (survey.expiredAt < new Date() || survey.remainingCount <= 0) {
    return {
      error: "Unauthorized: Survey token expired",
      survey: null,
    };
  }

  return { error: null, survey };
}

export async function checkSurveyTokenValidity(request: NextRequest, companyId: string) {
  const tokenHash = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!tokenHash) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Missing survey token" }, { status: 401 }),
      survey: null,
    };
  }
  
  const survey = await db
    .select()
    .from(surveyTable)
    .where(and(eq(surveyTable.companyId, companyId), eq(surveyTable.token, tokenHash)))
    .limit(1)
    .then((res) => res[0]);
  
  if (!survey) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Invalid survey token" }, { status: 401 }),
      survey: null,
    };
  }
  
  const isValid = survey.expiredAt > new Date() && survey.remainingCount > 0;
  return { error: null, isValid };
}

export async function decrementSurveyTokenCount(request: NextRequest) {
  const tokenHash = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!tokenHash) return;

  await db
    .update(surveyTable)
    .set({
      remainingCount: sql`${surveyTable.remainingCount} - 1`,
    })
    .where(
      and(
        eq(surveyTable.token, tokenHash),
        sql`${surveyTable.remainingCount} > 0`,
        gt(surveyTable.expiredAt, new Date())
      )
    );
}
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
import { surveyToken as surveyTable } from "@/db/schema";
import { eq, and, sql, gt } from "drizzle-orm";
import { SHA256 } from "crypto-js";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";

const SURVEY_TOKEN_SECRET = process.env.SURVEY_TOKEN_SECRET ?? "dev-survey-secret";

export async function generateSurveyToken(companyId: string, maxUses: number) {
  const randomString = crypto.getRandomValues(new Uint32Array(16)).join("-");
  const tokenHash = SHA256(randomString).toString();
  await db
    .insert(surveyTable)
    .values({
      companyId,
      token: tokenHash,
      remainingCount: maxUses,
    });

  const encryptedToken = AES.encrypt(tokenHash, SURVEY_TOKEN_SECRET).toString();
  return encryptedToken;
}

export async function authSurveyToken(request: NextRequest, companyId: string) {
  const encryptedHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!encryptedHeader) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Missing survey token" }, { status: 401 }),
      survey: null,
    };
  }

  let tokenHash: string | null = null;
  try {
    tokenHash = AES.decrypt(encryptedHeader, SURVEY_TOKEN_SECRET).toString(encUtf8);
  } catch {
    return {
      error: NextResponse.json({ error: "Unauthorized: Invalid survey token" }, { status: 401 }),
      survey: null,
    };
  }

  if (!tokenHash) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Invalid survey token" }, { status: 401 }),
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

  if (survey.expiredAt < new Date() || survey.remainingCount <= 0) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Survey token expired" }, { status: 401 }),
      survey: null,
    };
  }

  return { error: null, survey };
}

export async function checkSurveyTokenValidity(request: NextRequest, companyId: string) {
  const encryptedHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!encryptedHeader) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Missing survey token" }, { status: 401 }),
      survey: null,
    };
  }
  
  let tokenHash: string | null = null;
  try {
    tokenHash = AES.decrypt(encryptedHeader, SURVEY_TOKEN_SECRET).toString(encUtf8);
  } catch {
    return {
      error: NextResponse.json({ error: "Unauthorized: Invalid survey token" }, { status: 401 }),
      survey: null,
    };
  }
  
  if (!tokenHash) {
    return {
      error: NextResponse.json({ error: "Unauthorized: Invalid survey token" }, { status: 401 }),
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
  const encryptedHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!encryptedHeader) return;

  let tokenHash: string | null = null;
  try {
    tokenHash = AES.decrypt(encryptedHeader, SURVEY_TOKEN_SECRET).toString(encUtf8);
  } catch {
    return;
  }
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
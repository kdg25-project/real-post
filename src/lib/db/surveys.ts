import { db } from "@/db";
import {
  survey,
  surveyImage,
  companyProfile,
  favorite,
  user,
} from "@/db/schema";
import { eq, like, and, inArray, sql, or } from "drizzle-orm";

type CompanyCategory = "other" | "food" | "culture" | "activity" | "shopping";
type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export interface GetSurveysParams {
  page: number;
  limit: number;
  category?: string | null;
  query?: string | null;
  ageGroups?: string[] | null;
  countries?: string[] | null;
  genders?: ("male" | "female" | "other")[] | null;
  userId?: string | null;
}

export async function getSurveysFromDB(params: GetSurveysParams) {
  const {
    page,
    limit,
    category,
    query,
    ageGroups,
    countries,
    genders,
    userId,
  } = params;

  const categoryVal = category as CompanyCategory | null;
  const offset = (page - 1) * limit;

  // 1) surveys を取得(必要なら where 条件を追加)
  const surveys = await db
    .select({
      id: survey.id,
      description: survey.description,
      thumbnailUrl: survey.thumbnailUrl,
      companyId: survey.companyId,
      gender: survey.gender,
      ageGroup: survey.ageGroup,
      satisfactionLevel: survey.satisfactionLevel,
      country: survey.country,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      companyCategory: companyProfile.companyCategory,
      companyName: companyProfile.companyName,
      companyImage: user.image,
      favoriteCount: sql<number>`count(${favorite.id})`.mapWith(Number),
    })
    .from(survey)
    .leftJoin(companyProfile, eq(companyProfile.userId, survey.companyId))
    .leftJoin(user, eq(user.id, survey.companyId))
    .leftJoin(favorite, eq(favorite.surveyId, survey.id))
    .where(
      and(
        categoryVal
          ? eq(companyProfile.companyCategory, categoryVal)
          : undefined,
        query
          ? or(
              like(survey.description, `%${query}%`),
              like(companyProfile.companyName, `%${query}%`),
              like(survey.country, `%${query}%`),
            )
          : undefined,
        ageGroups && ageGroups.length > 0
          ? inArray(survey.ageGroup, ageGroups as AgeGroup[])
          : undefined,
        countries && countries.length > 0
          ? inArray(survey.country, countries)
          : undefined,
        genders && genders.length > 0
          ? inArray(survey.gender, genders)
          : undefined,
      ),
    )
    .groupBy(
      survey.id,
      companyProfile.companyCategory,
      companyProfile.companyName,
      user.image,
    )
    .limit(limit)
    .offset(offset);

  const surveyIds = surveys.map((s) => s.id);
  if (surveyIds.length === 0) {
    return [];
  }

  // 2) 画像をまとめて取得
  const images = await db
    .select({
      surveyId: surveyImage.surveyId,
      url: surveyImage.imageUrl,
    })
    .from(surveyImage)
    .where(inArray(surveyImage.surveyId, surveyIds));

  const imagesBySurvey = images.reduce<Record<string, string[]>>((acc, cur) => {
    const key = String(cur.surveyId);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cur.url);
    return acc;
  }, {});

  // 3) ログインしていれば favorites を取得して存在判定
  const favoriteSet = new Set<string>();
  if (userId) {
    const favs = await db
      .select({ surveyId: favorite.surveyId })
      .from(favorite)
      .where(
        and(eq(favorite.userId, userId), inArray(favorite.surveyId, surveyIds)),
      );

    favs.forEach((f) => favoriteSet.add(String(f.surveyId)));
  }

  // 4) レスポンス整形
  const data = surveys.map((s) => ({
    id: String(s.id),
    description: s.description ?? "",
    thumbnailUrl: s.thumbnailUrl ?? s.companyImage ?? null,
    imageUrls: imagesBySurvey[String(s.id)] ?? [],
    gender: s.gender ?? null,
    ageGroup: s.ageGroup ?? null,
    satisfactionLevel: s.satisfactionLevel ?? 0,
    country: s.country ?? "",
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
    isFavorited: userId ? favoriteSet.has(String(s.id)) : null,
    companyCategory: (s.companyCategory as CompanyCategory) ?? "other",
    companyName: s.companyName ?? "",
    favoriteCount: s.favoriteCount,
  }));

  return data;
}

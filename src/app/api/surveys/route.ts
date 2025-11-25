import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { survey, surveyImage, companyProfile, favorite, user } from "@/db/schema";
import { eq, like, and, inArray, sql, or } from "drizzle-orm";

type CompanyCategory = "other" | "food" | "culture" | "activity" | "shopping";
type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id ?? null;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    // パラメータは複数指定をサポート (繰り返しパラメータ or カンマ区切り)
    const categoryList = searchParams
      .getAll("category")
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
    const queryList = searchParams
      .getAll("query")
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
    const ageGroupList = searchParams
      .getAll("age_group")
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
    const countryList = searchParams
      .getAll("country")
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
    const genderList = searchParams
      .getAll("gender")
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);

    const offset = (page - 1) * limit;

    // 判定: ページ/リミット以外にフィルタが何も指定されていない (全件取得 & 再並び替えを行う)
    const noFilters =
      categoryList.length === 0 &&
      queryList.length === 0 &&
      ageGroupList.length === 0 &&
      countryList.length === 0 &&
      genderList.length === 0;

    // 1) surveys を取得(必要なら where 条件を追加)
    const baseQuery = db
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
          categoryList.length
            ? inArray(companyProfile.companyCategory, categoryList as CompanyCategory[])
            : undefined,
          queryList.length
            ? or(...queryList.map((q) => like(survey.description, `%${q}%`)))
            : undefined,
          ageGroupList.length ? inArray(survey.ageGroup, ageGroupList as AgeGroup[]) : undefined,
          countryList.length ? inArray(survey.country, countryList) : undefined,
          genderList.length
            ? inArray(survey.gender, genderList as ("male" | "female" | "other")[])
            : undefined
        )
      )
      .groupBy(survey.id, companyProfile.companyCategory, companyProfile.companyName, user.image);

    // noFilters の場合は全件取得して並べ替え後にページングを適用する。
    // フィルタがある場合は DB 側で limit/offset を適用して効率化する。
    let surveys = noFilters ? await baseQuery : await baseQuery.limit(limit).offset(offset);

    // フィルタ無しの場合、同一会社のサーベイが連続して表示されないように順序を調整する
    if (noFilters && surveys.length > 1) {
      // companyId をキーにしてキュー化
      const groups = new Map<string, (typeof surveys)[0][]>();
      surveys.forEach((s) => {
        const key = String(s.companyId ?? "__null__");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
      });

      const entries: Array<{ cid: string; arr: (typeof surveys)[0][] }> = Array.from(
        groups.entries()
      ).map(([cid, arr]) => ({ cid, arr }));
      const total = surveys.length;
      const ordered: typeof surveys = [];
      let lastCompany: string | null = null;

      // Greedy: 毎回残数が多い会社から選ぶ。ただし直前の会社は避ける。
      while (ordered.length < total) {
        // 残数で降順ソート
        entries.sort((a, b) => b.arr.length - a.arr.length);

        // 直前会社ではない最上位を探す
        let chosenIndex = -1;
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].arr.length === 0) continue;
          if (entries[i].cid === lastCompany) continue;
          chosenIndex = i;
          break;
        }

        // 見つからない場合（残っているのは直前会社のみなど）、最上位を使う
        if (chosenIndex === -1) {
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].arr.length > 0) {
              chosenIndex = i;
              break;
            }
          }
        }

        if (chosenIndex === -1) break; // safety

        const chosen = entries[chosenIndex];
        ordered.push(chosen.arr.shift()!);
        lastCompany = chosen.cid;
      }

      surveys = ordered;
    }
    // ページング: フィルタ無しなら並べ替えた結果から slice、そうでなければ既に DB 側で制限済
    const pagedSurveys = noFilters ? surveys.slice(offset, offset + limit) : surveys;

    const surveyIds = pagedSurveys.map((s) => s.id);
    if (surveyIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No surveys",
        data: [],
      });
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
        .where(and(eq(favorite.userId, userId), inArray(favorite.surveyId, surveyIds)));

      favs.forEach((f) => favoriteSet.add(String(f.surveyId)));
    }

    // 4) レスポンス整形
    const data = pagedSurveys.map((s) => ({
      companyId: String(s.companyId),
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

    return NextResponse.json({
      success: true,
      message: "Surveys fetched",
      data,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch surveys",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // カンパニーユーザーのみがサーベイを作成可能
    if (session.user.accountType !== "company") {
      return NextResponse.json(
        { success: false, message: "Only company accounts can create surveys" },
        { status: 403 }
      );
    }

    // FormDataで受け取る
    const formData = await request.formData();
    const description = formData.get("description");
    const gender = formData.get("gender");
    const ageGroup = formData.get("ageGroup");
    const satisfactionLevel = formData.get("satisfactionLevel");
    const country = formData.get("country");
    const thumbnailFile = formData.get("thumbnail");

    // サムネイル画像をアップロード
    let thumbnailUrl: string | null = null;
    if (thumbnailFile && thumbnailFile instanceof File) {
      const { uploadFileToR2 } = await import("@/lib/r2");
      thumbnailUrl = await uploadFileToR2(thumbnailFile, "surveys");
    }

    // サーベイを作成
    const newSurvey = await db
      .insert(survey)
      .values({
        id: crypto.randomUUID(),
        companyId: session.user.id,
        description: description ? String(description) : null,
        thumbnailUrl: thumbnailUrl,
        gender: gender ? (String(gender) as "male" | "female" | "other") : null,
        ageGroup: ageGroup ? (String(ageGroup) as AgeGroup) : null,
        satisfactionLevel: satisfactionLevel ? parseInt(String(satisfactionLevel)) : null,
        country: country ? String(country) : null,
      })
      .returning();

    // サムネイルを画像としても追加
    if (thumbnailUrl) {
      await db.insert(surveyImage).values({
        id: crypto.randomUUID(),
        surveyId: newSurvey[0].id,
        imageUrl: thumbnailUrl,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Survey created successfully",
        data: newSurvey[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create survey",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ------------------------------
// トップページ用（既存）
// ------------------------------
export async function getSurveysForTop(page: number, limit: number) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/surveys/unique-per-company?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch surveys");
    }

    const json = await res.json();
    console.log(json)
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// 検索・フィルタ付き一覧
// ------------------------------
// 検索 + 絞り込み一覧
// ------------------------------
export async function getSurveys({
  page,
  limit,
  category,
  query,
  ageGroup,
  country,
  gender,
}: {
  page: number;
  limit: number;
  category?: string;
  query?: string;
  ageGroup?: string;
  country?: string;
  gender?: string;
}) {
  try {
    const url = new URL(`${BASE_URL}/api/surveys`);

    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    if (category) url.searchParams.set("category", category);
    if (query) url.searchParams.set("query", query);
    if (ageGroup) url.searchParams.set("age_group", ageGroup);
    if (country) url.searchParams.set("country", country);
    if (gender) url.searchParams.set("gender", gender);

    // ← ここでURLをログ
    console.log("[getSurveys] Fetch URL:", url.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch surveys");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// お気に入り一覧専用
export async function getFavoriteSurveys() {}

// 店舗管理画面用
export async function getSurveysForStore() {}

// ------------------------------
// 詳細ページ用
// ------------------------------
export async function getSurveyDetail(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/surveys/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch survey detail");
    }

    const json = await res.json();
    console.log(json)
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ------------------------------
// トップページ用（既存）
// ------------------------------
export async function getSurveysForTop(page: number, limit: number) {
  try {
    const res = await fetch(
      `/api/surveys/unique-per-company?page=${page}&limit=${limit}`,
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
export async function getSurveys(params: {
  page: number;
  limit: number;
  category?: string;
  query?: string;
  ageGroup?: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
  country?: string;
  gender?: "male" | "female" | "other" | null;
}) {
  try {
    const query = new URLSearchParams();

    query.set("page", String(params.page));
    query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);
    if (params.query) query.set("query", params.query);
    if (params.ageGroup) query.set("age_group", params.ageGroup);
    if (params.country) query.set("country", params.country);
    if (params.gender) query.set("gender", params.gender);

    const url = `/api/surveys?${query.toString()}`;

    console.log("[getSurveys] URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch surveys");

    return await res.json();
  } catch (err) {
    console.error("[getSurveys] ERROR:", err);
    return null;
  }
}

// ------------------------------
// お気に入り一覧専用
// ------------------------------
export async function getFavoriteSurveys() {
  try {
    const res = await fetch("/api/users/favorite", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

// 店舗管理画面用
export async function getSurveysForStore() {}

// ------------------------------
// 詳細ページ用
// ------------------------------
export async function getSurveyDetail(id: string) {
  try {
    const res = await fetch(`/api/surveys/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch survey detail");
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// 検索・フィルタ付き一覧
export async function getSurveys() {}

// お気に入り一覧専用
export async function getFavoriteSurveys() {}

// 店舗管理画面用
export async function getSurveysForStore() {}
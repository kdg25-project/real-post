// ------------------------------
// Helper function to build absolute URLs
// ------------------------------
function getBaseUrl() {
  // Server-side: use environment variable or localhost
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }
  // Client-side: use window.location.origin
  return window.location.origin;
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
  ageGroups?: string[];
  countries?: string[];
  gender?: "male" | "female" | "other" | null;
}) {
  try {
    const queryParams: string[] = [];

    queryParams.push(`page=${params.page}`);
    queryParams.push(`limit=${params.limit}`);
    if (params.category) queryParams.push(`category=${params.category}`);
    if (params.query)
      queryParams.push(`query=${encodeURIComponent(params.query)}`);
    if (params.ageGroups && params.ageGroups.length > 0) {
      queryParams.push(`age_group=${params.ageGroups.join(",")}`);
    }
    if (params.countries && params.countries.length > 0) {
      queryParams.push(`country=${params.countries.join(",")}`);
    }
    if (params.gender) queryParams.push(`gender=${params.gender}`);

    const url = `${getBaseUrl()}/api/surveys?${queryParams.join("&")}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
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
    const url = `${getBaseUrl()}/api/users/favorite`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

// ------------------------------
// 店舗詳細専用
// ------------------------------
export async function getSurveysForStore(
  companyId: string,
  page: number,
  limit: number,
) {
  try {
    const url = `${getBaseUrl()}/api/surveys/company/${companyId}?page=${page}&limit=${limit}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch surveys for store");
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("[getSurveysForStore] ERROR:", err);
    return null;
  }
}

// ------------------------------
// 詳細ページ用
// ------------------------------
export async function getSurveyDetail(id: string) {
  try {
    const url = `${getBaseUrl()}/api/surveys/${id}`;
    const res = await fetch(url, {
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

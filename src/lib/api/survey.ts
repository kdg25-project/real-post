// トップページ専用
export async function getSurveysForTop() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/api/surveys?limit=2`;
  
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const json = await res.json();
  
      if (!json.success) {
        return {
          success: false,
          message: json.message || "Failed to fetch surveys",
          data: [],
        };
      }
  
      // 必要なデータだけ抽出
      const formatted = json.data.map((item: any) => ({
        id: item.id,
        thumbnailUrl: item.thumbnailUrl,
        satisfactionLevel: item.satisfactionLevel,
        country: item.country,
        // user_favorite: item.user_favorite, // API 実装後に追加
        isFavorite: item.isFavorite,
      }));
  
      return {
        success: true,
        message: "success",
        data: formatted,
      };
    } catch (err) {
      return {
        success: false,
        message: "Network error",
        data: [],
      };
    }
}
  

// 検索・フィルタ付き一覧
export async function getSurveys() {}

// お気に入り一覧専用
export async function getFavoriteSurveys() {}

// 店舗管理画面用
export async function getSurveysForStore() {}
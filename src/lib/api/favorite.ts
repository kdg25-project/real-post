export async function toggleFavorite(surveyId: string) {
    try {
        const res = await fetch(`/api/surveys/${surveyId}/favorite`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to toggle favorite: ${res.status}`);
        }

        const data = await res.json();
        console.log("トグル！")
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getFavoriteSurveys(): Promise<any[]> {
    try {
      const res = await fetch("/api/users/favorite", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to fetch favorites");
  
      const json: { success: boolean; message: string; data: any[] } = await res.json();
      return json.data ?? []; // 必ず配列を返す
    } catch (err) {
      console.error(err);
      return []; // エラー時も空配列を返す
    }
}
// ------------------------------
// グッズ一覧を取得
// ------------------------------
export async function getGoodsList(page: number, limit: number) {
  try {
    const res = await fetch(`/api/goods?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to toggle favorite: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ------------------------------
// グッズを個別取得
// ------------------------------
export async function getCompanyGoods(companyId: string) {
  try {
    const res = await fetch(`/api/goods/company/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to toggle favorite: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

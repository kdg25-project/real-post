export type GetCompanyDetail = {
  "success": true;
  "message": string;
  "data": {
    "id": string;
    "userId": string;
    "companyName": string;
    "imageUrl": string;
    "placeId": string;
    "companyCategory": "";
    "createdAt": string;
    "updatedAt": string;
    "goods": {
      "id": string;
      "name": string;
      "imageUrl": string;
    };
  }
}
  | {
    "success": false;
    "message": string;
  }

export async function getCompanyDetail(companyId: string): Promise<GetCompanyDetail> {
  try {
    const res = await fetch(`/api/company/${companyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch company detail");
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "取得に失敗しました。",
    }
  }
}

export type SurveyCreateRequest = {
    description: string;
    thumbnail?: Blob | File;
    images?: Array<Blob | File>;
    gender: "male" | "female" | "other" | null;
    ageGroup: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
    satisfactionLevel: number; // 1から5を想定
    country: string;
}

export type SurveyCreateResponse = {
    success: true;
    message: string;
    data: {
        id: string;
        description: string;
        thumbnailUrl: string;
        imageUrls: Array<string>;
        gender: "male" | "female" | "other" | null;
        ageGroup: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
        satisfactionLevel: number; // 1から5を想定
        country: string;
        createdAt: string; // ISO8601形式
        updatedAt: string; // ISO8601形式
        isFavorite: boolean | null; // 未ログインユーザーはnull
    }
}
    | {
        success: false;
        message: string;
    }

export function SurveyCreate(req: SurveyCreateRequest, id: string, token: string | null): Promise<SurveyCreateResponse> {
    const formData = new FormData();
    formData.append("description", req.description);
    formData.append("country", req.country);
    formData.append("satisfactionLevel", req.satisfactionLevel.toString());
    formData.append("gender", req.gender ?? "");
    formData.append("ageGroup", req.ageGroup ?? "");
    formData.append("thumbnail", req.thumbnail ?? "");
    formData.append("images", JSON.stringify(req.images ?? []));

    return fetch(`/api/surveys/company/${id}`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
        .then((res) => res.json())
        .catch((err) => {
            console.warn(err);
            return {
                success: false,
                message: "Failed to create survey",
            }
        })
};

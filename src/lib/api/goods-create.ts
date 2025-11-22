export type GoodsCreateRequest = {
    name: string;
    images: Array<Blob>;
}

export type GoodsCreateResponse = {
    success: true;
    message: string;
    data: {
        id: string;
        companyId: string;
        name: string;
        createdAt: string; // ISO 8601
        updatedAt: string; // ISO 8601
        image_urls: Array<string>;
    }

    }
    | {
    success: false;
    message: string;
}

export function GoodsCreate(req: GoodsCreateRequest): Promise<GoodsCreateResponse> {
    const formData = new FormData();
    formData.append("name", req.name);
    formData.append("images", JSON.stringify(req.images));


    return fetch(`/api/goods`, {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .catch((err) => {
            console.warn(err);
            return {
                success: false,
                message: "Failed to create goods",
            }
        })
}
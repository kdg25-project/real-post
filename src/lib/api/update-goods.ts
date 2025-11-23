export type UpdateGoodsRequest  = {
    name: string;
    // NOTE: 1枚だけ送る様にして
    images: Array<Blob>; // バイナリ
    deleteImageIds: Array<string>;
};

export type UpdateGoodsResponse = {
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
    };

export function UpdateGoods(req: UpdateGoodsRequest, id: string): Promise<UpdateGoodsResponse> {
    const formData = new FormData();
    formData.append("name", req.name);
    formData.append("images", req.images[0]);

    return fetch(`/api/goods/${id}`, {
        method: "PATCH",
        body: formData,
    })
        .then((res) => res.json())
        .catch((err) => {
            console.warn(err);
            return {
                success: false,
                message: "Failed to update goods",
            }
        })
}
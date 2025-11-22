export type companyEditRequest  = {
    companyName: string;
    companyCategory: string;
    imageFile: Blob | File;
};

export type companyEditResponse = {
    success: true,
        message: string,
        data: {
            id: string,
            userId: string,
            companyName: string,
            imageUrl: string,
            companyCategory: string,
            createdAt: string,
            updatedAt: string,
        }
    }
    | {
        success: false,
        message: string,
    };

export function companyEdit(req: companyEditRequest): Promise<companyEditResponse> {
    const formData = new FormData();
    formData.append("companyName", req.companyName);
    formData.append("companyCategory", req.companyCategory);
    formData.append("imageFile", req.imageFile);

    return fetch(`/api/company`, {
        method:"PATCH",
        body: formData,
})
    .then((res) => res.json())
    .catch((err) => {
        console.warn(err);
        return {
            success: false,
            message: "Failed to edit company",
        }
    })
};
export type CompanyCreateRequest = {
    companyName: string;
    companyCategory: string;
    placeUrl: string;
    imageFile: Blob | File;
}

export type CompanyCreateResponse = {
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
    }

export function companyCreate(req: CompanyCreateRequest): Promise<CompanyCreateResponse> {
    const formData = new FormData();
    formData.append("companyName", req.companyName);
    formData.append("companyCategory", req.companyCategory);
    formData.append("imageFile", req.imageFile);
    formData.append("placeUrl", req.placeUrl);

    return fetch(`/api/company`,
        {
            method: "POST",
            // headers: {
            //     "Content-Type": "multipart/form-data",
            // },
            body: formData
        })
        .then((res) => res.json())
        .catch((err: Error) => {
            console.warn(err);
            return {
                success: false,
                message: "Failed to create company",
            }
        });
}

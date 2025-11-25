export type CompanyEditRequest = {
  companyName: string;
  companyCategory: string;
  imageFile: Blob | File;
  placeId?: string;
};

export type CompanyEditResponse =
  | {
      success: true;
      message: string;
      data: {
        id: string;
        userId: string;
        companyName: string;
        imageUrl: string;
        companyCategory: string;
        createdAt: string;
        updatedAt: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export function CompanyEdit(req: CompanyEditRequest): Promise<CompanyEditResponse> {
  const formData = new FormData();
  formData.append("companyName", req.companyName);
  formData.append("companyCategory", req.companyCategory);
  formData.append("imageFile", req.imageFile);
  // formData.append("placeUrl", req.placeUrl);

  return fetch(`/api/company`, {
    method: "PATCH",
    body: formData,
  })
    .then((res) => res.json())
    .catch((err) => {
      console.warn(err);
      return {
        success: false,
        message: "Failed to edit company",
      };
    });
}

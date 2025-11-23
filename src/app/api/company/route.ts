import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { requireCompanyAccount } from "@/lib/auth-middleware";
import { companyProfile } from "@/db/schema";
import { uploadFileToR2 } from "@/lib/r2";
import { extractPlaceIdFromGoogleMapsUrl } from "@/lib/placeIdFormetter";

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireCompanyAccount(request);
    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    // company_profileを登録
    // formDataで受け取る
    const formData = await request.formData();
    const companyName = formData.get("companyName");
    const companyCategory = formData.get("companyCategory");
    const imageFile = formData.get("image");
    const placeUrl = formData.get("placeUrl") || null;
    let placeId = formData.get("placeId") || null;

    if (!placeId && !placeUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Either placeUrl or placeId must be provided",
          data: null,
        },
        { status: 400 }
      );
    }

    // NOTE: placeIdを送っているのでここでは不要
    // if (!placeId && placeUrl) {
    //   try {
    //     const extracted = await extractPlaceIdFromGoogleMapsUrl(String(placeUrl));
    //     placeId = extracted;
    //   } catch (err: unknown) {
    //     console.error("Error resolving placeId from Google Maps API:", err);
    //     const msg = err instanceof Error ? err.message : String(err);
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: msg || "Failed to retrieve place_id from Google Maps API",
    //         data: null,
    //       },
    //       { status: 500 }
    //     );
    //   }
    // if (placeUrl && !placeId) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Invalid Google Maps URL for placeId",
    //       data: null,
    //     },
    //     { status: 400 }
    //   );
    // }
    // }

    let imageUrl: string | null = null;
    if (imageFile && imageFile instanceof File) {
      // R2にアップロード
      imageUrl = await uploadFileToR2(imageFile, "company-profiles");
    }

    const [existingProfile] = await db
      .select()
      .from(companyProfile)
      .where(eq(companyProfile.userId, user.id))
      .limit(1);

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Company profile already exists",
          data: null,
        },
        { status: 400 }
      );
    }

    const result = await db
      .insert(companyProfile)
      .values({
        id: crypto.randomUUID(),
        userId: user.id,
        companyName: String(companyName),
        companyCategory: String(companyCategory) as
          | "food"
          | "culture"
          | "activity"
          | "shopping"
          | "other",
        imageUrl: imageUrl,
        placeId: (placeId as string) || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Company profile created successfully",
        data: result[0],
      }
    );
  } catch (error) {
    console.error("Error creating company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    const { error, user } = await requireCompanyAccount(request);
    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    const [profile] = await db
      .select()
      .from(companyProfile)
      .where(eq(companyProfile.userId, user.id))
      .limit(1);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Company profile not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Company profile fetched successfully",
        data: profile,
      }
    );
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  try {
    const { error, user } = await requireCompanyAccount(request);
    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: error,
          data: null,
        },
        { status: 401 }
      );
    }

    // company_profileを更新
    const formData = await request.formData();
    const companyName = formData.get("companyName");
    const companyCategory = formData.get("companyCategory");
    const imageFile = formData.get("image");

    const placeUrlRaw = formData.get("placeUrl");
    const placeIdRaw = formData.get("placeId");

    let placeIdValue: string | undefined = undefined;
    if (placeIdRaw !== null) {
      placeIdValue = String(placeIdRaw);
    }

    if (placeUrlRaw !== null) {
      let placeUrl = String(placeUrlRaw);
      if (placeUrl.includes("maps.app.goo.gl")) {
        try {
          const response = await fetch(placeUrl, {
            method: "HEAD",
            redirect: "follow",
          });
          placeUrl = response.url;
        } catch (err) {
          console.error("Error resolving placeUrl redirect:", err);
        }
      }

      if (!placeIdValue && placeUrl.length > 0) {
        try {
          const extractedId = await extractPlaceIdFromGoogleMapsUrl(placeUrl);
          if (extractedId) {
            placeIdValue = extractedId;
          } else {
            return NextResponse.json(
              {
                success: false,
                message: "Invalid Google Maps URL",
                data: null,
              },
              { status: 400 }
            );
          }
        } catch (err: unknown) {
          console.error("Error resolving placeId from Google Maps API:", err);
          const msg = err instanceof Error ? err.message : String(err);
          return NextResponse.json(
            {
              success: false,
              message: msg || "Failed to retrieve place_id from Google Maps API",
              data: null,
            },
            { status: 500 }
          );
        }
      }
    }

    let imageUrl: string | null = null;
    if (imageFile && imageFile instanceof File) {
      // R2にアップロード
      imageUrl = await uploadFileToR2(imageFile, "company-profiles");
    }

    const updates: Record<string, unknown> = {};
    if (companyName !== null) {
      updates.companyName = String(companyName);
    }
    if (companyCategory !== null) {
      updates.companyCategory = String(companyCategory);
    }
    if (imageUrl) {
      updates.imageUrl = imageUrl;
    }
    if (placeIdValue !== undefined) {
      updates.placeId = placeIdValue;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No updates provided",
          data: null,
        },
        { status: 400 }
      );
    }

    const result = await db
      .update(companyProfile)
      .set(updates)
      .where(eq(companyProfile.userId, user.id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Company profile updated successfully",
        data: result[0],
      }
    );
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update company profile",
        data: null,
      },
      { status: 500 }
    );
  }
}
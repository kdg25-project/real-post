import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("limit") || "10");
    const allGoods = await db.query.goods.findMany({
      with: {
        images: true,
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    return Response.json({
      success: true,
      message: "Goods fetched successfully",
      data: allGoods,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch goods",
      },
      { status: 500 },
    );
  }
}

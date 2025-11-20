import { db } from "@/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const goodsfromid = await db.query.goods.findMany({
      with: {
        images: true,
      },
      where: (table, { eq }) => eq(table.companyId, id),
    });
    if (goodsfromid.length === 0) {
      return new Response("Not Found", { status: 404 });
    }
    return Response.json({
      success: true,
      message: "Goods fetched successfully",
      data: goodsfromid,
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

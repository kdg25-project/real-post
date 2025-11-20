import { db } from "@/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const goodsfromid = await db.query.goods.findFirst({
      with: {
        images: true,
      },
      where: (table, { eq }) => eq(table.id, id),
    });
    if (!goodsfromid) {
      return Response.json(
        {
          success: false,
          message: "Not Found",
        },
        { status: 404 },
      );
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

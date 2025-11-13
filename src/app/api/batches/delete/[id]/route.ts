import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = params;

    await prisma.batch.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Batch deleted" });

  } catch (error) {
    console.log("Delete Batch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete batch" },
      { status: 500 }
    );
  }
}

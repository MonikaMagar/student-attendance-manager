import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function DELETE(req: NextRequest, context: any) {
  try {
    const id = context.params.id;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Student deleted" });

  } catch (error) {
    console.log("Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

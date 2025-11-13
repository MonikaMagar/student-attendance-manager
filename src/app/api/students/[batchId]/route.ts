import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const batchId = params.batchId;
    const date = req.nextUrl.searchParams.get("date");

    if (!batchId)
      return NextResponse.json({ error: "Batch ID missing" }, { status: 400 });

    const students = await prisma.batchStudent.findMany({
      where: { batchId },
      include: { student: true },
    });

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Student load error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

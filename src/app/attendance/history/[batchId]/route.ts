import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const batchId = params.batchId;

    const records = await prisma.attendance.findMany({
      where: { batchId },
      include: {
        student: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error("History load error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { batchId } = params;

    const students = await prisma.batchStudent.findMany({
      where: { batchId },
      include: { student: true }
    });

    return NextResponse.json({
      success: true,
      students
    });

  } catch (error) {
    console.log("Fetch Students Error:", error);
    return NextResponse.json({ error: "Failed to load students" }, { status: 500 });
  }
}

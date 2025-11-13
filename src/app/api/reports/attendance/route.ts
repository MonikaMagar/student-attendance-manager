import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { batchId, startDate, endDate } = await req.json();

    if (!batchId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const reports = await prisma.attendance.findMany({
      where: {
        batchId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        student: true,
        batch: true
      },
      orderBy: {
        date: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      reports
    });

  } catch (error) {
    console.log("Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

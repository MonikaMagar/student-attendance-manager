import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { batchId, attendance } = await req.json();

    if (!batchId || !attendance || attendance.length === 0) {
      return NextResponse.json(
        { error: "Invalid attendance request" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Save all attendance
    for (const entry of attendance) {
      await prisma.attendance.upsert({
        where: {
          studentId_batchId_date: {
            studentId: entry.studentId,
            batchId,
            date: today
          }
        },
        update: { status: entry.status },
        create: {
          studentId: entry.studentId,
          batchId,
          date: today,
          status: entry.status
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Attendance saved"
    });

  } catch (error) {
    console.log("Mark Attendance Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

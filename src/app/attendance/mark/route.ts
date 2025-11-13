import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { batchId, date, attendance } = await req.json();

    if (!batchId || !date || !attendance) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);

    // Delete existing attendance for the same date
    await prisma.attendance.deleteMany({
      where: { batchId, date: attendanceDate },
    });

    // Insert new attendance records
    await prisma.attendance.createMany({
      data: attendance.map((a: any) => ({
        studentId: a.studentId,
        batchId,
        date: attendanceDate,
        status: a.status,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Attendance marking error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

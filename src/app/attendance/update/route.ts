import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status)
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );

    await prisma.attendance.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance updated",
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

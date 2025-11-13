import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(req) {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      students
    });

  } catch (error) {
    console.log("Student List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

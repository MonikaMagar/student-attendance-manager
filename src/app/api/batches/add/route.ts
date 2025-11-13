import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, startTime, endTime } = await req.json();

    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Batch created",
      batch,
    });
  } catch (error) {
    console.log("Batch Add Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

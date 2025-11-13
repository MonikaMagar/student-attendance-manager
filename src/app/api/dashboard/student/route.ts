// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";
// import { AuthService } from "@/app/lib/auth";

// export async function GET(req: NextRequest) {
//   try {
//     // Get JWT token from header
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: "No token provided" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.replace("Bearer ", "");
//     const decoded: any = AuthService.verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Ensure only students can access student dashboard
//     if (decoded.role !== "STUDENT") {
//       return NextResponse.json(
//         { error: "Only students can access this dashboard" },
//         { status: 403 }
//       );
//     }

//     const studentId = decoded.userId;

//     // Fetch attendance history
//     const attendanceHistory = await prisma.attendance.findMany({
//       where: { studentId },
//       include: {
//         batch: true
//       },
//       orderBy: { date: "desc" }
//     });

//     const total = attendanceHistory.length;
//     const presentDays = attendanceHistory.filter((a: typeof attendanceHistory[0]) => a.status === "PRESENT").length;
//     const absentDays = attendanceHistory.filter((a: typeof attendanceHistory[0]) => a.status === "ABSENT").length;

//     // Fetch student's batch
//     const batchInfo = await prisma.batchStudent.findMany({
//       where: { studentId },
//       include: { batch: true }
//     });

//     return NextResponse.json({
//       success: true,
//       totalDays: total,
//       presentDays,
//       absentDays,
//       batches: batchInfo,
//       history: attendanceHistory
//     });

//   } catch (error) {
//     console.error("Student Dashboard Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { AuthService } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = AuthService.verifyToken(token);

    if (!decoded || decoded.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const studentId = decoded.userId;

    const attendanceHistory = await prisma.attendance.findMany({
      where: { studentId },
      include: { batch: true },
      orderBy: { date: "desc" }
    });

    const total = attendanceHistory.length;
    const presentDays = attendanceHistory.filter((a: typeof attendanceHistory[0]) => a.status === "PRESENT").length;
    const absentDays = attendanceHistory.filter((a: typeof attendanceHistory[0]) => a.status === "ABSENT").length;

    const batchInfo = await prisma.batchStudent.findMany({
      where: { studentId },
      include: { batch: true }
    });

    return NextResponse.json({
      success: true,
      totalDays: total,
      presentDays,
      absentDays,
      batches: batchInfo,
      history: attendanceHistory
    });

  } catch (error) {
    console.error("Student Dashboard Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

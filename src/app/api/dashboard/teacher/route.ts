import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Total students
    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT' }
    })

    // Total batches
    const totalBatches = await prisma.batch.count()

    // Today's attendance
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAttendance = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: today
        }
      },
      _count: {
        status: true
      }
    })

    // Batch-wise statistics
    const batches = await prisma.batch.findMany({
      include: {
        _count: {
          select: {
            students: true,
            attendance: {
              where: {
                status: 'PRESENT',
                date: {
                  gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
              }
            }
          }
        }
      }
    })

    const stats = {
      totalStudents,
      totalBatches,
      todayAttendance,
      batchStats: batches
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    
    // Return default values in case of error
    return NextResponse.json({
      totalStudents: 0,
      totalBatches: 0,
      todayAttendance: [],
      batchStats: []
    })
  }
}
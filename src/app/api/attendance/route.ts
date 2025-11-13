import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { batchId, date, attendance } = await request.json()

    if (!batchId || !date || !attendance) {
      return NextResponse.json({ error: 'Batch ID, date and attendance data required' }, { status: 400 })
    }

    const attendanceRecords = await Promise.all(
      attendance.map((record: any) =>
        prisma.attendance.upsert({
          where: {
            studentId_batchId_date: {
              studentId: record.studentId,
              batchId,
              date: new Date(date)
            }
          },
          update: {
            status: record.status
          },
          create: {
            studentId: record.studentId,
            batchId,
            date: new Date(date),
            status: record.status
          }
        })
      )
    )

    return NextResponse.json(attendanceRecords, { status: 201 })
  } catch (error) {
    console.error('Mark attendance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const batchId = searchParams.get('batchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (studentId) where.studentId = studentId
    if (batchId) where.batchId = batchId
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        batch: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
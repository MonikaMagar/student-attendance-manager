import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const attendance = await prisma.attendance.findMany({
      where: {
        batchId: batchId || undefined,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined
        }
      },
      include: {
        student: true,
        batch: true
      }
    })

    // Convert to CSV
    const csv = [
      ['Date', 'Student Name', 'Batch', 'Status'],
      ...attendance.map((record: typeof attendance[number]) => [
        record.date.toISOString().split('T')[0],
        record.student.name,
        record.batch.name,
        record.status
      ])
    ].map(row => row.join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=attendance.csv'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
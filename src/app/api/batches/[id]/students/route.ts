import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { studentIds } = await request.json()
    const batchId = params.id

    if (!studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: 'Student IDs array required' }, { status: 400 })
    }

    const batchStudents = await Promise.all(
      studentIds.map(studentId =>
        prisma.batchStudent.create({
          data: {
            batchId,
            studentId
          },
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
      )
    )

    return NextResponse.json(batchStudents, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
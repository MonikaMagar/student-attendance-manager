import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(batches)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, startTime, endTime } = await request.json()

    if (!name || !startTime || !endTime) {
      return NextResponse.json({ error: 'Name, start time and end time required' }, { status: 400 })
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    })

    return NextResponse.json(batch, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
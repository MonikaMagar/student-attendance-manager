import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { AuthService } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      message: 'User created successfully',
      user 
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
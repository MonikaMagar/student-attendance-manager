import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { AuthService } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if email exists
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Hash password
    const hashed = await AuthService.hashPassword(password)

    // Create student
    const student = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashed,
        role: "STUDENT"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student
    })

  } catch (error) {
    console.error("Add Student Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

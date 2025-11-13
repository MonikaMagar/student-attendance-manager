export interface LoginRequest {
  email: string
  password: string
}

export interface StudentCreateRequest {
  name: string
  email: string
  mobile?: string
  password: string
}

export interface BatchCreateRequest {
  name: string
  startTime: string
  endTime: string
}

export interface AttendanceMarkRequest {
  studentId: string
  batchId: string
  date: string
  status: 'PRESENT' | 'ABSENT'
}

export interface JwtPayload {
  userId: string
  email: string
  role: string
}
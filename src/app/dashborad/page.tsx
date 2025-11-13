'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  todayAttendance: any[]
  batchStats: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)
    
    // Check if user is a teacher
    if (userObj.role !== 'TEACHER') {
      router.push('/student-dashboard')
      return
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  // Calculate today's present count safely
  const todayPresent = stats?.todayAttendance?.find((a: any) => a.status === 'PRESENT')?._count?.status || 0
  const todayAbsent = stats?.todayAttendance?.find((a: any) => a.status === 'ABSENT')?._count?.status || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-500">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                {stats?.totalStudents || 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Batches</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                {stats?.totalBatches || 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Today's Present</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {todayPresent}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Today's Absent</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">
                {todayAbsent}
              </dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link 
            href="/students" 
            className="bg-indigo-600 text-white p-6 rounded-lg text-center hover:bg-indigo-700 transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="font-semibold">Manage Students</span>
            </div>
          </Link>
          <Link 
            href="/batches" 
            className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700 transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-semibold">Manage Batches</span>
            </div>
          </Link>
          <Link 
            href="/attendance" 
            className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Mark Attendance</span>
            </div>
          </Link>
          <Link 
            href="/reports" 
            className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700 transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold">View Reports</span>
            </div>
          </Link>
        </div>

        {/* Batch Statistics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Batch Statistics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of all batches and their student counts
            </p>
          </div>
          <div className="border-t border-gray-200">
            {stats?.batchStats && stats.batchStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-4 p-6">
                {stats.batchStats.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-gray-900">{batch.name}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Total Students: {batch._count?.students || 0}</p>
                      <p>Schedule: {new Date(batch.startTime).toLocaleTimeString()} - {new Date(batch.endTime).toLocaleTimeString()}</p>
                      <p className="text-green-600">
                        Recent Present: {batch._count?.attendance || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                No batches created yet. <Link href="/batches" className="text-indigo-600 hover:text-indigo-500">Create your first batch</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
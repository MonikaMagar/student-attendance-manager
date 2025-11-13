'use client'

import { useState, useEffect } from 'react'

interface Batch {
  id: string
  name: string
  students: {
    student: {
      id: string
      name: string
      email: string
    }
  }[]
}

interface StudentAttendance {
  studentId: string
  name: string
  status: 'PRESENT' | 'ABSENT'
}

export default function AttendancePage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/batches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setBatches(data)
    } catch (error) {
      console.error('Error fetching batches:', error)
    }
  }

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId)
    const batch = batches.find(b => b.id === batchId)
    if (batch) {
      setAttendance(
        batch.students.map(bs => ({
          studentId: bs.student.id,
          name: bs.student.name,
          status: 'PRESENT'
        }))
      )
    }
  }

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev =>
      prev.map(item =>
        item.studentId === studentId
          ? { ...item, status: item.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
          : item
      )
    )
  }

  const submitAttendance = async () => {
    if (!selectedBatch) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          batchId: selectedBatch,
          date: selectedDate,
          attendance
        })
      })

      if (response.ok) {
        alert('Attendance marked successfully!')
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Error marking attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a batch</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {selectedBatch && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Student Attendance</h3>
            <div className="space-y-2">
              {attendance.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between p-3 border rounded">
                  <span>{item.name}</span>
                  <button
                    onClick={() => toggleAttendance(item.studentId)}
                    className={`px-4 py-1 rounded ${
                      item.status === 'PRESENT' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={submitAttendance}
              disabled={loading || attendance.length === 0}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
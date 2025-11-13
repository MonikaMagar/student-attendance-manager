'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'STUDENT' | 'TEACHER' | ''

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState<Role>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))

          if (data.user.role === 'TEACHER') {
            router.push('/teacher/dashboard')
          } else {
            router.push('/student/dashboard')
          }
        } else {
          setError(data.error || 'Login failed')
        }

      } else {
        if (role !== 'TEACHER') {
          setError('Only teachers can register.')
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, mobile, password, role: 'TEACHER' }),
        })

        const data = await response.json()

        if (response.ok) {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const loginData = await loginResponse.json()

          if (loginResponse.ok) {
            localStorage.setItem('token', loginData.token)
            localStorage.setItem('user', JSON.stringify(loginData.user))

            router.push('/teacher/dashboard')
          }
        } else {
          setError(data.error || 'Registration failed')
        }
      }

    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-black shadow-lg text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📚 StudentTrack
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md ${
              isLogin ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md ${
              !isLogin ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Register
          </button>
        </div>
      </nav>

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900">
            Welcome to <span className="text-indigo-600">StudentTrack</span>
          </h1>

          <p className="mt-6 text-xl text-gray-700">
            A modern attendance management system for Teachers & Students.
          </p>

          <ul className="mt-8 space-y-3 text-lg text-gray-700">
            <li>✔ Track attendance in real-time</li>
            <li>✔ Teacher & Student dashboards</li>
            <li>✔ Batch-based attendance</li>
            <li>✔ Reports & insights</li>
          </ul>
        </div>

        {/* LOGIN/REGISTER CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">

          {/* Tab Buttons */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-medium ${
                isLogin ? 'border-b-2 border-black text-black' : 'text-gray-500'
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-medium ${
                !isLogin ? 'border-b-2 border-black text-black' : 'text-gray-500'
              }`}
            >
              Register (Teacher)
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                {error}
              </div>
            )}

            {/* REGISTER FIELDS */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  className="w-full p-3 border rounded"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  className="w-full p-3 border rounded"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`w-full p-3 border rounded font-medium ${
                    role === 'TEACHER'
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  👨‍🏫 Register as Teacher
                </button>
              </>
            )}

            {/* COMMON FIELDS */}
            <input
              type="email"
              className="w-full p-3 border rounded"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full p-3 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {loading ? 'Please wait…' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-6 text-center">
        © {new Date().getFullYear()} StudentTrack. All Rights Reserved.
      </footer>
    </div>
  )
}

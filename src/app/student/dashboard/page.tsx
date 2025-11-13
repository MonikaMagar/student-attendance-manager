'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ICONS (Heroicons)
function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m-4 4h8a2 2 0 002-2v-8m0-4l2 2" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3h7v7H3zM14 3h7v4h-7zM14 9h7v12h-7zM3 12h7v9H3z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  );
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/dashboard/student", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log("Error:", err);
    }
    setLoading(false);
  }

  // LOGOUT FUNCTION
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  if (loading) return <div className="p-10 text-xl">Loading dashboard...</div>;
  if (!stats?.success)
    return (
      <div className="p-10 text-red-600 text-xl">
        Failed to load student dashboard
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-10 text-black">

      {/* FULL STUDENT NAVBAR */}
      <div className="bg-white shadow px-6 py-4 rounded-xl mb-8 flex justify-between items-center">
        
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:text-gray-700">
            <HomeIcon /> Home
          </Link>

          <Link href="/student/dashboard" className="flex items-center gap-2 text-lg font-semibold hover:text-gray-700">
            <DashboardIcon /> Dashboard
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <LogoutIcon /> Logout
        </button>
      </div>

      {/* TITLE + HOME BUTTON (Option A) */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold">Student Dashboard</h1>

        <Link
          href="/"
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
        >
          Home
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card title="Total Attendance Days" value={stats.totalDays} />
        <Card title="Present Days" value={stats.presentDays} />
        <Card title="Absent Days" value={stats.absentDays} />
      </div>

      {/* Batch Section */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Your Batch</h2>

      {stats.batches.length === 0 ? (
        <p className="text-gray-600">You are not assigned to any batch yet.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow">
          <ul>
            {stats.batches.map((b: any) => (
              <li key={b.id} className="border-b py-3">
                <p className="text-lg font-bold">{b.batch.name}</p>
                <p className="text-gray-700">
                  {new Date(b.batch.startTime).toLocaleTimeString()} –
                  {new Date(b.batch.endTime).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-12 mb-4">Attendance History</h2>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto text-black">
        {stats.history.length === 0 ? (
          <p className="text-gray-600">No attendance records found.</p>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Batch</th>
              </tr>
            </thead>

            <tbody>
              {stats.history.map((h: any) => (
                <tr key={h.id} className="border-b">
                  <td className="py-3 px-4">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{h.status}</td>
                  <td className="py-3 px-4">{h.batch?.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="p-6 rounded-xl shadow bg-white text-black">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------- BLACK SVG ICONS ---------------------- */
const UserIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a7 7 0 017-7h2a7 7 0 017 7v1" />
  </svg>
);

const BatchIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="14" rx="2" />
    <path strokeLinecap="round" d="M3 9h18" />
  </svg>
);

const AttendanceIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h18v18H3z" />
    <path d="M7 14h2v4H7zM11 10h2v8h-2zM15 6h2v12h-2z" />
  </svg>
);
/* ------------------------------------------------------------- */

export default function TeacherDashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const res = await fetch("/api/dashboard/teacher");
    const data = await res.json();
    setStats(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  if (!stats) return <div className="p-6 text-xl">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">

      {/* 🔳 TOP NAVBAR — BLACK THEME */}
      <div className="bg-white shadow-md rounded-xl px-6 py-4 mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Home
          </button>

          <button
            onClick={logout}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔳 DASHBOARD STATS — BLACK TEXT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <DashboardCard title="Total Students" value={stats.totalStudents} />

        <DashboardCard title="Total Batches" value={stats.totalBatches} />

        <DashboardCard title="Today Present" value={stats.todayAttendance.length} />

        <DashboardCard title="Attendance Pending" value={stats.totalStudents - stats.todayAttendance.length} />
      </div>

      {/* 🔳 BATCH TABLE */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Batch-wise Attendance (Last 30 Days)</h2>

      {stats.batchStats.length === 0 ? (
        <p className="text-gray-500">No batches found</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="min-w-full text-left text-black">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4">Batch Name</th>
                <th className="py-3 px-4">Total Students</th>
                <th className="py-3 px-4">Present (30 days)</th>
              </tr>
            </thead>

            <tbody>
              {stats.batchStats.map((b: any) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{b.name}</td>
                  <td className="py-3 px-4">{b._count.students}</td>
                  <td className="py-3 px-4">{b._count.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔳 QUICK ACTION BUTTONS — BLACK ICONS */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <ActionButton text="Add Student" link="/teacher/students/add" icon={<UserIcon />} />

        <ActionButton text="Create Batch" link="/teacher/batches/add" icon={<BatchIcon />} />

        <ActionButton text="Mark Attendance" link="/teacher/attendance" icon={<AttendanceIcon />} />

        <ActionButton text="View Reports" link="/teacher/reports" icon={<ReportIcon />} />
      </div>

    </div>
  );
}

/* ----------------------- COMPONENTS ------------------------- */

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 rounded-xl shadow bg-white text-black">
      <p className="text-xl font-semibold">{title}</p>
      <h2 className="text-4xl font-bold mt-3">{value}</h2>
    </div>
  );
}

function ActionButton({ text, link, icon }: { text: string; link: string; icon: any }) {
  return (
    <a
      href={link}
      className="flex items-center justify-center gap-3 p-6 bg-black text-white rounded-xl shadow text-xl hover:bg-gray-800 transition"
    >
      {icon}
      {text}
    </a>
  );
}

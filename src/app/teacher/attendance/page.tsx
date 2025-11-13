'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [batchId, setBatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendance, setAttendance] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Auto-select today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Load all batches
  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    const res = await fetch("/api/batches/list");
    const data = await res.json();
    if (data.success) setBatches(data.batches);
  }

  // Load students for selected batch + date
  async function loadStudents(batchId: string) {
    setStudents([]);
    setAttendance({});
    setMessage("");

    if (!selectedDate) return;

    const res = await fetch(
      `/api/attendance/students/${batchId}?date=${selectedDate}`
    );

    const data = await res.json();

    if (data.success) {
      setStudents(data.students);

      const init: any = {};
      data.students.forEach((s: any) => {
        init[s.student.id] = "PRESENT";
      });
      setAttendance(init);
    }
  }

  // Load attendance history
  async function loadHistory() {
    const res = await fetch(`/api/attendance/history/${batchId}`);
    const data = await res.json();
    if (data.success) setHistory(data.records);
  }

  // Toggle attendance (PRESENT/ABSENT)
  function toggleAttendance(id: string) {
    setAttendance((prev: any) => ({
      ...prev,
      [id]: prev[id] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
  }

  // Submit attendance
  async function submit() {
    console.log("Submitting:", { batchId, selectedDate, attendance });

    if (!batchId) {
      setMessage("Please select batch");
      return;
    }

    if (!selectedDate) {
      setMessage("Please select date");
      return;
    }

    if (Object.keys(attendance).length === 0) {
      setMessage("No students found");
      return;
    }

    const payload = {
      batchId,
      date: selectedDate,
      attendance: Object.keys(attendance).map((id) => ({
        studentId: id,
        status: attendance[id],
      })),
    };

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.message);

    loadHistory();
  }

  // UPDATE old attendance record
  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/attendance/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();
    if (data.success) loadHistory();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Attendance Management</h1>

        <button
          onClick={() => router.push("/teacher/dashboard")}
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Batch */}
        <div className="bg-white p-5 rounded-xl shadow">
          <label className="block font-medium mb-2">Select Batch</label>

          <select
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
              loadStudents(e.target.value);
              loadHistory();
            }}
            className="w-full p-3 border rounded"
          >
            <option value="">-- Select Batch --</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="bg-white p-5 rounded-xl shadow">
          <label className="block font-medium mb-2">Select Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);

              if (batchId && e.target.value) {
                loadStudents(batchId);
              }
            }}
          />
        </div>

        {/* Submit */}
        <div className="bg-white p-5 rounded-xl shadow flex items-end">
          <button
            onClick={submit}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Submit Attendance
          </button>
        </div>
      </div>

      {/* Mark Attendance Table */}
      {students.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s: any) => (
                <tr key={s.student.id} className="border-b">
                  <td className="py-3 px-4">{s.student.name}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleAttendance(s.student.id)}
                      className={`px-5 py-2 rounded text-white font-medium ${
                        attendance[s.student.id] === "PRESENT"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {attendance[s.student.id]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {message && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">
              {message}
            </div>
          )}
        </div>
      )}

      {/* Attendance History */}
      {history.length > 0 && (
        <div className="mt-12 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Attendance History</h2>

          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Edit</th>
              </tr>
            </thead>

            <tbody>
              {history.map((rec: any) => (
                <tr key={rec.id} className="border-b">
                  <td className="py-3 px-4">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">{rec.student.name}</td>

                  <td className={`py-3 px-4 font-semibold ${
                    rec.status === "PRESENT" ? "text-green-600" : "text-red-600"
                  }`}>
                    {rec.status}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        updateStatus(
                          rec.id,
                          rec.status === "PRESENT" ? "ABSENT" : "PRESENT"
                        )
                      }
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Toggle
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

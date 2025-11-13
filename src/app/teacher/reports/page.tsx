'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [batchId, setBatchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    const res = await fetch("/api/batches/list");
    const data = await res.json();
    if (data.success) setBatches(data.batches);
  }

  async function generateReport() {
    setLoading(true);

    const res = await fetch("/api/reports/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId, startDate, endDate })
    });

    const data = await res.json();
    if (data.success) setReports(data.reports);

    setLoading(false);
  }

  function exportCSV() {
    let csv = "Name,Email,Date,Status,Batch\n";

    reports.forEach((r) => {
      csv += `${r.student.name},${r.student.email},${new Date(
        r.date
      ).toLocaleDateString()},${r.status},${r.batch.name}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">

      {/* NAVBAR */}
      <div className="w-full bg-black text-white px-8 py-4 flex items-center justify-between shadow">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📊 <span>Attendance Reports</span>
        </h1>

        <div className="flex gap-4">
          {/* Home */}
          <button
            onClick={() => router.push("/teacher/dashboard")}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
          >
            🏠 Home
          </button>

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-10">

        {/* FILTER SECTION */}
        <span className="text-lg font-semibold text-indigo-700">Report Filters</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 mt-2 rounded-xl shadow">

          {/* Batch Selector */}
          <div>
            <label className="font-medium text-gray-700 mb-1 block">
              Select Batch <span className="text-red-500">*</span>
            </label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
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

          {/* Start */}
          <div>
            <label className="font-medium text-gray-700 mb-1 block">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End */}
          <div>
            <label className="font-medium text-gray-700 mb-1 block">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* GENERATE REPORT BUTTON */}
        <button
          onClick={generateReport}
          disabled={loading}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        {/* EXPORT */}
        {reports.length > 0 && (
          <button
            onClick={exportCSV}
            className="mt-6 ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            ⬇ Export CSV
          </button>
        )}

        {/* REPORT TABLE */}
        <div className="mt-10 bg-white shadow p-6 rounded-xl overflow-x-auto">
          <span className="text-xl font-semibold text-gray-800 mb-4 block">
            Attendance Report Results
          </span>

          {reports.length === 0 ? (
            <p className="text-gray-500">No reports found.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Batch</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{r.student.name}</td>
                    <td className="py-3 px-4">{r.student.email}</td>
                    <td className="py-3 px-4">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        r.status === "PRESENT"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.status}
                    </td>
                    <td className="py-3 px-4">{r.batch.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

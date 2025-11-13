'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BatchListPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBatchList();
  }, []);

  async function loadBatchList() {
    const res = await fetch("/api/batches/list");
    const data = await res.json();

    if (data.success) setBatches(data.batches);
    setLoading(false);
  }

  async function deleteBatch(id: string) {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    const res = await fetch(`/api/batches/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Batch deleted");
      loadBatchList();
    } else {
      alert("Failed to delete");
    }
  }

  if (loading)
    return <div className="p-10 text-xl">Loading batches...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">

      {/* NAVBAR */}
      <div className="w-full bg-black text-white px-8 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📘 Batch List
        </h1>

        <div className="flex gap-4">
          {/* Home */}
          <button
            onClick={() => router.push("/teacher/dashboard")}
            className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200"
          >
            🏠 Home
          </button>

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-10">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Batches</h2>

          <a
            href="/teacher/batches/add"
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            ➕ Add Batch
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto border border-gray-200">

          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4">Batch Name</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">End Time</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No batches found.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">
                      {batch.name}
                    </td>

                    <td className="py-3 px-4">
                      {new Date(batch.startTime).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      {new Date(batch.endTime).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 flex gap-4">

                      {/* Edit Button */}
                      <a
                        href={`/teacher/batches/edit/${batch.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        ✏️ Edit
                      </a>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteBatch(batch.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        🗑️ Delete
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

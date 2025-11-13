'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBatchPage() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/batches/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          startTime,
          endTime
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create batch");
      } else {
        setSuccess("Batch created successfully!");
        setName("");
        setStartTime("");
        setEndTime("");

        setTimeout(() => {
          router.push("/teacher/batches");
        }, 1200);
      }

    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">

      {/* ------- NAVBAR -------- */}
      <div className="w-full bg-black text-white px-8 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-indigo-400">📘</span> Add New Batch
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

      {/* -------- Form Section -------- */}
      <div className="p-10 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-xl max-w-xl w-full border border-gray-200"
        >
          {/* Errors / Success */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded font-medium animate-pulse">
              {success}
            </div>
          )}

          {/* Batch Name */}
          <div className="mb-6">
            <label className="font-medium text-gray-700 mb-2 block">
              Batch Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Full Stack Morning Batch"
            />
          </div>

          {/* Start Time */}
          <div className="mb-6">
            <label className="font-medium text-gray-700 mb-2 block">
              Start Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>

          {/* End Time */}
          <div className="mb-6">
            <label className="font-medium text-gray-700 mb-2 block">
              End Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>
        </form>
      </div>
    </div>
  );
}

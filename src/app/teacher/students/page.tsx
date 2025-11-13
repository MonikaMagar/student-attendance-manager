'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

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

      const res = await fetch("/api/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add student");
      } else {
        setSuccess("Student added successfully!");

        setName("");
        setEmail("");
        setMobile("");
        setPassword("");

        setTimeout(() => {
          router.push("/teacher/students");
        }, 1200);
      }

    } catch (err) {
      console.log(err);
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">

      {/* NAVBAR */}
      <div className="w-full bg-black text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          👨‍🎓 Add Student
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

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Add New Student
          </h2>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
              {success}
            </div>
          )}

          {/* Student Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Student Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter student email"
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter student password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

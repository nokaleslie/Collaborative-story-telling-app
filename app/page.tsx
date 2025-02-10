"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Collaborative Storytelling</h1>
      <p className="text-gray-600 text-lg mt-4 max-w-2xl">
        Co-write stories, vote on the next parts, and engage with other writers!
      </p>

      {/* Buttons with proper spacing */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Link href="/explore">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition">
            Explore Stories
          </button>
        </Link>
        <Link href="/create">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition">
            Create a Story
          </button>
        </Link>
        <Link href="/auth">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md transition">
            Login / Signup
          </button>
        </Link>
      </div>
    </main>
  );
}
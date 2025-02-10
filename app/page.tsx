"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Welcome to Collaborative Storytelling</h1>
      <p className="text-gray-600 text-lg mt-4">
        Co-write stories, vote on the next parts, and engage with other writers!
      </p>

      <div className="mt-6 flex gap-4">
        <Link href="/explore">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">Explore Stories</button>
        </Link>
        <Link href="/create">
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg">Create a Story</button>
        </Link>
        <Link href="/auth">
          <button className="bg-gray-500 text-white px-6 py-2 rounded-lg">Login / Signup</button>
        </Link>
      </div>
    </main>
  );
}

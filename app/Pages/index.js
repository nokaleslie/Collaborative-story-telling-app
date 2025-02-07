import { useEffect, useState } from "react";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">StoryCollab</h1>
      <div>
        <Link href="/explore" className="mx-3 text-gray-600 hover:text-gray-800">Explore Stories</Link>
        <Link href="/create" className="mx-3 text-gray-600 hover:text-gray-800">Create Story</Link>
        {!user ? (
          <Link href="/auth" className="mx-3 text-blue-600 font-semibold">Login/Signup</Link>
        ) : (
          <button onClick={logout} className="text-red-500 font-semibold">Logout</button>
        )}
      </div>
    </nav>
  );
}
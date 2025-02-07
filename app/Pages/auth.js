import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to StoryCollab</h2>
        {!user ? (
          <>
            <p className="mb-4">Sign in to collaborate on stories!</p>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Sign in with Google
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">Hello, {user.displayName}!</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
}

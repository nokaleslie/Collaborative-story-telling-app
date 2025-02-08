import { useState, useEffect } from "react";
import { db, auth, collection, getDocs, doc, getDoc } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFavorites(currentUser.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchFavorites = async (userId) => {
    const snapshot = await getDocs(collection(db, "user_favorites"));
    const favoriteStories = snapshot.docs
      .map((doc) => doc.data())
      .filter((fav) => fav.userId === userId);

    // Fetch actual stories
    const stories = await Promise.all(
      favoriteStories.map(async (fav) => {
        const storyRef = doc(db, "completed_stories", fav.storyId);
        const storyDoc = await getDoc(storyRef);
        return storyDoc.exists() ? { id: fav.storyId, ...storyDoc.data() } : null;
      })
    );

    setFavorites(stories.filter((story) => story !== null));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">My Favorite Stories</h2>
      {favorites.length > 0 ? (
        favorites.map((story) => (
          <div key={story.id} className="bg-white p-4 shadow rounded-lg mb-4">
            {story.story.map((section, index) => (
              <p key={index} className="text-lg mb-2">
                {section.text} <br />
                <span className="text-sm text-gray-500">- {section.username}</span>
              </p>
            ))}
            <p className="text-sm text-gray-400">
              Completed on: {new Date(story.completedAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No favorite stories yet.</p>
      )}
    </div>
  );
}

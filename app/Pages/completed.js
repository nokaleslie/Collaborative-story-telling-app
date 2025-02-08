import { useState, useEffect } from "react";
import { db, auth, collection, getDocs, updateDoc, doc, setDoc, getDoc } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";


export default function CompletedStories() {
  const [completedStories, setCompletedStories] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
  
      const fetchCompletedStories = async () => {
        const snapshot = await getDocs(collection(db, "completed_stories"));
        const stories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCompletedStories(stories);
      };
  
      fetchCompletedStories();
      return () => unsubscribeAuth();
    }, []);
  
    // Like a story
    const likeStory = async (storyId) => {
      if (!user) return alert("You must be logged in to like a story.");
  
      const storyRef = doc(db, "completed_stories", storyId);
      const storyDoc = await getDoc(storyRef);
  
      if (storyDoc.exists()) {
        const storyData = storyDoc.data();
        const updatedLikes = (storyData.likes || 0) + 1;
  
        await updateDoc(storyRef, { likes: updatedLikes });
  
        // Save favorite in user_favorites
        await setDoc(doc(db, "user_favorites", `${user.uid}_${storyId}`), {
          userId: user.uid,
          storyId: storyId,
        });
  
        // Update local state
        setCompletedStories((prevStories) =>
          prevStories.map((story) =>
            story.id === storyId ? { ...story, likes: updatedLikes } : story
          )
        );
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-4">Completed Stories</h2>
        {completedStories.length > 0 ? (
          completedStories.map((story) => (
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
  
              {/* Like Button */}
              <button
                onClick={() => likeStory(story.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                ❤️ Like ({story.likes || 0})
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No completed stories yet.</p>
        )}
      </div>
    );
  }
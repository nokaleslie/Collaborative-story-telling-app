import { useState, useEffect } from "react";
import { auth, db, collection, addDoc, getDocs, onSnapshot } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function StoryPage() {
  const [user, setUser] = useState(null);
  const [story, setStory] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    // Track user authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch story updates
    const unsubscribeStory = onSnapshot(collection(db, "story"), (snapshot) => {
      const storyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStory(storyData);
    });

    // Fetch comments for all sections
    const unsubscribeComments = onSnapshot(collection(db, "comments"), (snapshot) => {
      const commentsData = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!commentsData[data.storyId]) commentsData[data.storyId] = [];
        commentsData[data.storyId].push({ id: doc.id, ...data });
      });
      setComments(commentsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeStory();
      unsubscribeComments();
    };
  }, []);

  // Handle new comment input
  const handleCommentChange = (storyId, value) => {
    setNewComments({ ...newComments, [storyId]: value });
  };

  // Add a comment to Firestore
  const addComment = async (storyId) => {
    if (!newComments[storyId]?.trim()) return;

    await addDoc(collection(db, "comments"), {
      text: newComments[storyId],
      userId: user.uid,
      username: user.displayName,
      storyId: storyId,
      createdAt: new Date(),
    });

    setNewComments({ ...newComments, [storyId]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Story & Comments</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        {story.map((section, index) => (
          <div key={index} className="border-b pb-2 mb-4">
            <p className="text-lg">{section.text}</p>
            <p className="text-sm text-gray-500">- {section.username}</p>

            {/* Comments Section */}
            <div className="mt-2">
              <h4 className="text-md font-bold">Comments</h4>
              {comments[section.id]?.length > 0 ? (
                comments[section.id].map((comment) => (
                  <p key={comment.id} className="text-sm text-gray-600">
                    <strong>{comment.username}: </strong> {comment.text}
                  </p>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add Comment */}
            {user && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Add a comment..."
                  value={newComments[section.id] || ""}
                  onChange={(e) => handleCommentChange(section.id, e.target.value)}
                />
                <button
                  onClick={() => addComment(section.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
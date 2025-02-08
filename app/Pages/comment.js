import { useState, useEffect } from "react";
import { db, auth, collection, doc, getDocs, addDoc, onSnapshot } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Comments({ storyId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchComments = () => {
      return onSnapshot(collection(db, "story", storyId, "comments"), (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments);
      });
    };

    const unsubscribeComments = fetchComments();
    return () => unsubscribeAuth() || unsubscribeComments();
  }, [storyId]);

  const postComment = async () => {
    if (!user) return alert("You must be logged in to comment.");
    if (!newComment) return;

    await addDoc(collection(db, "story", storyId, "comments"), {
      text: newComment,
      username: user.displayName,
      createdAt: new Date()
    });

    setNewComment("");
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-2 rounded-md mb-2">
          <p>{comment.text}</p>
          <p className="text-sm text-gray-500">- {comment.username}</p>
        </div>
      ))}
      {user && (
        <div className="mt-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md"
          />
          <button onClick={postComment} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Post Comment
          </button>
        </div>
      )}
    </div>
  );
}

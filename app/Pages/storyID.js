import { useState, useEffect } from "react";
import { db, auth, collection, doc, getDoc, updateDoc, setDoc, addDoc, onSnapshot } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Story({ storyId }) {
  const [story, setStory] = useState(null);
  const [user, setUser] = useState(null);
  const [voteOptions, setVoteOptions] = useState([]);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchStory = async () => {
      const storyRef = doc(db, "story", storyId);
      const storySnap = await getDoc(storyRef);
      if (storySnap.exists()) {
        setStory({ id: storySnap.id, ...storySnap.data() });
      }
    };

    const fetchVotes = () => {
      const votesRef = collection(db, "story_votes", storyId, "options");
      return onSnapshot(votesRef, (snapshot) => {
        const options = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVoteOptions(options);
      });
    };

    fetchStory();
    const unsubscribeVotes = fetchVotes();

    return () => {
      unsubscribeAuth();
      unsubscribeVotes();
    };
  }, [storyId]);

  const castVote = async (optionId) => {
    if (!user) return alert("You must be logged in to vote.");
    const voteRef = doc(db, "story_votes", storyId, "options", optionId);
    await updateDoc(voteRef, { votes: (voteOptions.find(o => o.id === optionId)?.votes || 0) + 1 });

    setUserVote(optionId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {story && (
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-2xl font-bold">{story.title}</h2>
          <p>{story.content}</p>

          <h3 className="text-xl font-bold mt-4">Vote for the Next Section:</h3>
          {voteOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => castVote(option.id)}
              className={`block w-full mt-2 p-2 text-left rounded-md ${userVote === option.id ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {option.text} ({option.votes} votes)
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

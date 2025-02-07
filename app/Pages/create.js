import { useState, useEffect } from "react";
import { auth, db, collection, addDoc, getDocs, onSnapshot } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateStory() {
  const [user, setUser] = useState(null);
  const [story, setStory] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");

  useEffect(() => {
    // Track user authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch story updates in real-time
    const unsubscribeFirestore = onSnapshot(collection(db, "story"), (snapshot) => {
      const storyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStory(storyData);
    });

    // Fetch voting proposals
    const unsubscribeProposals = onSnapshot(collection(db, "story_proposals"), (snapshot) => {
      const proposalData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProposals(proposalData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeStory();
      unsubscribeProposals();
    };
  }, []);

 // Propose a new section for voting
 const proposeSection = async () => {
    if (!newProposal.trim()) return;

    await addDoc(collection(db, "story_proposals"), {
      text: newProposal,
      userId: user.uid,
      username: user.displayName,
      votes: 0,
    });

    setNewProposal("");
  };

  // Vote for a proposal
  const voteForProposal = async (proposalId, currentVotes) => {
    const proposalRef = doc(db, "story_proposals", proposalId);
    await updateDoc(proposalRef, { votes: currentVotes + 1 });
  };

  // Add the highest-voted section to the story
  const finalizeSection = async () => {
    if (proposals.length === 0) return;

    // Find the proposal with the highest votes
    const winningProposal = proposals.reduce((max, prop) => (prop.votes > max.votes ? prop : max), proposals[0]);

    // Add to the story
    await addDoc(collection(db, "story"), {
      text: winningProposal.text,
      userId: winningProposal.userId,
      username: winningProposal.username,
      createdAt: new Date(),
    });

    // Clear proposals after selection
    for (const proposal of proposals) {
      const proposalRef = doc(db, "story_proposals", proposal.id);
      await updateDoc(proposalRef, { text: "", votes: 0 }); // Reset votes
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Collaborative Story</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        {story.map((section, index) => (
          <div key={index} className="border-b pb-2 mb-2">
            <p className="text-lg">{section.text}</p>
            <p className="text-sm text-gray-500">- {section.username}</p>
          </div>
        ))}
      </div>

      {/* Proposal Submission */}
      {user && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Propose the next section..."
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
          />
          <button
            onClick={proposeSection}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Propose Section
          </button>
        </div>
      )}

      {/* Voting Section */}
      <div className="mt-6 bg-white p-4 shadow rounded-lg">
        <h3 className="text-xl font-bold mb-2">Vote for the Next Section</h3>
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <div key={proposal.id} className="border-b pb-2 mb-2">
              <p className="text-lg">{proposal.text}</p>
              <p className="text-sm text-gray-500">- {proposal.username}</p>
              <button
                onClick={() => voteForProposal(proposal.id, proposal.votes)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Vote ({proposal.votes})
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No proposals yet. Be the first to suggest!</p>
        )}
      </div>

      {/* Finalize Section */}
      {user && proposals.length > 0 && (
        <button
          onClick={finalizeSection}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Finalize & Add to Story
        </button>
      )}
    </div>
  );
}
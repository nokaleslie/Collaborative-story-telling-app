import { useState } from "react";
import { db, addDoc, collection } from "../firebaseConfig";

export default function ManageStory({ storyId }) {
  const [optionText, setOptionText] = useState("");

  const addVotingOption = async () => {
    if (!optionText) return;
    await addDoc(collection(db, "story_votes", storyId, "options"), {
      text: optionText,
      votes: 0
    });
    setOptionText("");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Manage Story Voting</h2>
      <input
        type="text"
        value={optionText}
        onChange={(e) => setOptionText(e.target.value)}
        placeholder="Add an option..."
        className="p-2 border rounded w-full mt-2"
      />
      <button onClick={addVotingOption} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Add Option
      </button>
    </div>
  );
}

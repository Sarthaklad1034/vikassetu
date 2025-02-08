import React, { useState, useEffect } from "react";
import api from "../../services/api";
import useAuth from '../../hooks/useAuth';

const VotingSystem = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    api.get("/community/polls")
      .then((res) => setPolls(res.data.data))
      .catch((err) => console.error("Error fetching polls:", err));
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    if (!user) return alert("Please log in to vote.");

    try {
      await api.post(`/community/polls/${pollId}/vote`, { optionIndex });
      setPolls(polls.map(poll =>
        poll._id === pollId ? { ...poll, userVoted: true } : poll
      ));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Community Polls</h2>

      {polls.map((poll) => (
        <div key={poll._id} className="bg-white p-4 rounded shadow mb-3">
          <h3 className="font-semibold">{poll.question}</h3>
          <div className="mt-2">
            {poll.options.map((option, index) => (
              <button
                key={index}
                className="block w-full p-2 border rounded my-1"
                onClick={() => handleVote(poll._id, index)}
                disabled={poll.userVoted}
              >
                {option.text} ({option.votes} votes)
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VotingSystem;

import React, { useState, useEffect } from "react";
import useAuth from '../../hooks/useAuth';
import api from "../../services/api";

const CommunityForum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // Fetch posts from backend
    api.get("/community/posts")
      .then((res) => setPosts(res.data.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await api.post("/community/posts", { content: newPost });
      setPosts([...posts, response.data.data]);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Community Forum</h2>

      {user && (
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Write something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button className="btn-primary mt-2" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      )}

      <div>
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow mb-3">
            <p className="text-gray-800">{post.content}</p>
            <small className="text-gray-500">Posted by {post.author.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;

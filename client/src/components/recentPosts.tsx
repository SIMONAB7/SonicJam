import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../conifg';
import './recentPosts.css';

interface Post {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  link: string;
  platform: string;
  description?: string;
  createdAt: string;
}

const RecentPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPosts(data.reverse()); // Newest first
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="recent-posts">
      {posts.length === 0 ? (
        <p>No shared songs yet :( Start by adding your favourites!</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <div className="post-card" key={post._id}>
              <div className="post-user">
                <img src={post.userId.profileImage || "/default-avatar.jpg"} alt="user" />
                <span>{post.userId.name}</span>
                {post.userId._id === currentUserId && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="delete-post-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
              {post.description && (
                <div className="recent-post-description">{post.description}</div>
              )}
              <div className="post-link">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.platform || "Listen"}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;

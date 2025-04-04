import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import './recentPosts.css';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  text: string;
  createdAt: string;
}

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
  likes?: string[];
  comments?: Comment[];
}

interface Props {
  userId?: string;
}

const RecentPosts: React.FC<Props> = ({ userId }) => {
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
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
        const filtered = userId
          ? data.filter((post: Post) => post.userId._id === userId)
          : data;
        setPosts(filtered.reverse());
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };

    fetchPosts();
  }, [userId]);

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

  const handleLike = async (postId: string) => {
    try {
      // Add additional logging for debugging
      console.log(`Liking post: ${postId} with token: ${token ? "present" : "missing"}`);
      
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"  // Add this
        },
      });
      
      console.log("Like response status:", res.status);
      
      if (res.ok) {
        const updated = await res.json();
        setPosts(prev =>
          prev.map(p =>
            p._id === postId
              ? { ...p, likes: updated.likes ? updated.likes : [] }
              : p
          )
        );
      } else {
        const errorText = await res.text();
        console.error("Like failed:", res.status, errorText);
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  
  const handleComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
  
    try {
      console.log(`Commenting on post: ${postId} with token: ${token ? "present" : "missing"}`);
      
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      console.log("Comment response status:", res.status);
      
      if (res.ok) {
        const newComment = await res.json();
        setPosts(prev =>
          prev.map(p =>
            p._id === postId
              ? { ...p, comments: [...(p.comments || []), newComment] }
              : p
          )
        );
        setCommentText(prev => ({ ...prev, [postId]: '' }));
      } else {
        const errorText = await res.text();
        console.error("Failed to post comment:", res.status, errorText);
      }
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="recent-posts">
      {posts.length === 0 ? (
        <p>No shared songs yet :(</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <div className="post-card" key={post._id}>
              <div className="post-user">
                <img src={post.userId.profileImage || "/default-avatar.jpg"} alt="user" />
                <span className="post-username">{post.userId.name}</span>
                {post.userId._id === currentUserId && (
                  <button onClick={() => handleDelete(post._id)} className="delete-post-btn">
                    Delete
                  </button>
                )}
              </div>

              {post.description && <div className="recent-post-description">{post.description}</div>}

              <div className="post-link">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.platform || "Listen"}
                </a>
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post._id)} className="like-button">
                  ❤️ {post.likes?.length || 0}
                </button>
              </div>

              <div className="comment-section">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ''}
                  onChange={(e) =>
                    setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))
                  }
                />
                <button onClick={() => handleComment(post._id)}>Post</button>

                {Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div className="comment-list">
                    {post.comments.map((cmt, idx) => (
                      <div className="comment" key={idx}>
                        <strong>{cmt.userId?.name}:</strong> {cmt.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;

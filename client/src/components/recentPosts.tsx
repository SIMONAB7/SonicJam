import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import './recentPosts.css';

//interfaces for user, comment, and post structure
interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface Comment {
  _id: string;
  userId: string; 
  userName?: string; 
  text: string;
  createdAt: string;
}

export interface Post {
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
  userId?: string;//prop to filter posts by user
}

const RecentPosts: React.FC<Props> = ({ userId }) => {
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});//track comment input per post
  const [posts, setPosts] = useState<Post[]>([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");


  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const endpoint =
        userId === "liked"
          ? `${API_BASE_URL}/api/posts?liked=true`
          : `${API_BASE_URL}/api/posts`;
  
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await res.json();
  
      const filtered =
        userId && userId !== "liked"
          ? data.filter((post: Post) => post.userId._id === userId)
          : data;
  
      setPosts(filtered);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };
  
  //fetch posts when component mounts or userId changes
  useEffect(() => {
    fetchPosts();
  }, [userId]);

  //delete post if current user is the owner
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

  //like/unlike a post
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts(prev =>
          prev.map(p =>
            p._id === postId
              ? { ...p, likes: updated.likes ?? [] }
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

  //submit a new comment for a post handler
  const handleComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const newComment = await res.json();
        console.log("New comment received:", newComment);
        
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), newComment],
                }
              : post
          )
        );
        setCommentText(prev => ({ ...prev, [postId]: '' }));//clear input
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
        <p>{userId === "liked" ? "No liked posts yet :(" : "No shared songs yet :("}</p>
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
              {/* description */}
              {post.description && <div className="recent-post-description">{post.description}</div>}
              {/* external link to music platforms */}
              <div className="post-link">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.platform || "Listen"}
                </a>
              </div>

              {/* like and comment section */}
              <div className="interaction-row">
                <div className="left-actions">
                  <button onClick={() => handleLike(post._id)} className="like-button">
                    ❤️ {post.likes?.length || 0}
                  </button>
                </div>

                <div className="right-actions comment-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ''}
                    onChange={(e) =>
                      setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))
                    }
                  />
                  <button onClick={() => handleComment(post._id)}>Post</button>
                </div>
              </div>
              {/* list of comments */}
              {Array.isArray(post.comments) && post.comments.length > 0 && (
                <div className="comment-list">
                  {post.comments.map((comment, idx) => (
                    <div className="comment" key={comment._id || idx}>
                      <strong>
                        {comment.userId === currentUserId 
                          ? 'You' 
                          : comment.userName || 'User'}:
                      </strong> {comment.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
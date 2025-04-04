import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './videos.css';
import API_BASE_URL from './config';

interface VideoUser {
  _id: string;
  name: string;
  profileImage?: string;
}

interface Video {
  _id?: string;
  title: string;
  artist: string;
  songName: string;
  tuning: string;
  description: string;
  url: string;
  isAnonymous: boolean;
  type: string;
  user?: VideoUser;
}

interface UserVideosProps {
  userId?: string; // ✅ Optional prop to override logged-in user
}

const UserVideos: React.FC<UserVideosProps> = ({ userId }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos`);
        if (Array.isArray(res.data)) {
          const isViewingOwnProfile = !userId || userId === currentUserId;
        
          const userVideos = res.data.filter((video: Video) => {
            const isVideoFromUser = video.user?._id === (userId || currentUserId);
            if (!isVideoFromUser) return false;
            if (!isViewingOwnProfile && video.isAnonymous) return false;
            return true;
          });
        
          setVideos(userVideos);
        } else {
          setVideos([]);
        }
        
      } catch (err) {
        console.error("Error fetching user videos:", err);
        setVideos([]);
      }
    };
  
    fetchVideos();
  }, [userId, currentUserId]);
  

  return (
    <div className="videos-page">
      <div className="video-grid">
        {videos.map(video => (
          <div key={video._id} className="video-card">
            <div className="video-title">
              <strong>{video.title}</strong>
              <div className="video-subtitle">
                {video.artist} — {video.songName}
              </div>
            </div>

            <div className="video-header">
              <img
                src={
                  video.isAnonymous
                    ? "/default-avatar.jpg"
                    : video.user?.profileImage || "/default-avatar.jpg"
                }
                alt="User"
                className="video-avatar"
              />
              <span>{video.isAnonymous ? "Anonymous" : video.user?.name}</span>
            </div>

            <video src={video.url} controls className="video-element" />

            <div
              className="video-description"
              onClick={() =>
                setExpandedVideo(expandedVideo === video._id ? null : video._id ?? "")
              }
            >
              <span className="description-label">Description</span>
              <div
                className={`description-content ${
                  expandedVideo === video._id ? "expanded" : ""
                }`}
              >
                <p className="description-text">{video.description}</p>
                <div className="video-tuning">Tuning: {video.tuning}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVideos;

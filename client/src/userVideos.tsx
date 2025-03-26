import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './videos.css';

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

const UserVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videos');
        const userVideos = res.data.filter((video: Video) => video.user?._id === currentUserId);
        setVideos(userVideos);
      } catch (err) {
        console.error('Error fetching user videos:', err);
      }
    };
    fetchVideos();
  }, [currentUserId]);

  return (
    <div className="videos-page">
      <div className="video-grid">
        {videos.map(video => (
          <div key={video._id} className="video-card">
            <div className="video-title">
              <strong>{video.title}</strong>
              <div className="video-subtitle">{video.artist} — {video.songName}</div>
            </div>

            <div className="video-header">
                <img
                    src={
                    video.isAnonymous
                        ? '/default-avatar.jpg'
                        : video.user?.profileImage || '/default-avatar.jpg'
                    }
                    alt="User"
                    className="video-avatar"
                />
                <span>{video.isAnonymous ? 'Anonymous' : video.user?.name}</span>
            </div>


            <video src={video.url} controls className="video-element" />
            <div className="video-description" onClick={() => setExpandedVideo(expandedVideo === video._id ? null : video._id ?? '')}>
                <span className="description-label">Description</span>

                <div className={`description-content ${expandedVideo === video._id ? 'expanded' : ''}`}>
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

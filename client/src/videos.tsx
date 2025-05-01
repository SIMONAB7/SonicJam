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

const Videos: React.FC = () => {
  //form state for new video upload
  const [formData, setFormData] = useState<Omit<Video, 'url'>>({
    title: '', artist: '', songName: '', tuning: '', description: '', isAnonymous: false, type: 'Tutorial',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);//all videos fetched
  const [showModal, setShowModal] = useState(false);//upload modal toggle
  const [filter, setFilter] = useState('All'); //video type filter
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 3;
  const currentUserId = localStorage.getItem("userId");

  //fetch videos from backend
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos`);
      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        setVideos([]);
        console.error("Unexpected video response format:", res.data);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  //handle changes in the upload form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  //submit video handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert('Please upload a video file');

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, String(value)));
    form.append('videoFile', videoFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/videos`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setFormData({ title: '', artist: '', songName: '', tuning: '', description: '', isAnonymous: false, type: 'Tutorial' });
      setVideoFile(null);
      setShowModal(false);
      fetchVideos();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Upload error:", err.response?.data || err.message);
      } else {
        console.error("Unknown upload error:", err);
      }
    }
  };

  //handle delete
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(videos.filter(video => video._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  //filter and paginate videos for better UI
  const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.type === filter);
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  return (
    <div className="videos-page">
      {/* controls for upload and filtering */}
      <div className="top-controls">
        <button className="post-toggle" onClick={() => setShowModal(true)}>Post Video</button>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Cover">Cover</option>
        </select>
      </div>

      {/* modal to upload new video */}
      {showModal && (
        <div className="modal-overlay-video" onClick={() => setShowModal(false)}>
          <div className="modal-video" onClick={e => e.stopPropagation()}>
            <form className="upload-form" onSubmit={handleSubmit}>
              <input name="title" placeholder="Add Video Title" value={formData.title} onChange={handleChange} required />
              <input name="artist" placeholder="Add Artist name" value={formData.artist} onChange={handleChange} />
              <input name="songName" placeholder="Add Song name" value={formData.songName} onChange={handleChange} />
              <input name="tuning" placeholder="Add Tuning" value={formData.tuning} onChange={handleChange} />
              <textarea name="description" placeholder="Add Description" value={formData.description} onChange={handleChange} />
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Tutorial">Tutorial</option>
                <option value="Cover">Cover</option>
              </select>
              <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} required />
              <div className="anon-toggle">
                <span>Post anonymous</span>
                <label><input type="radio" name="isAnonymous" checked={formData.isAnonymous} onChange={() => setFormData(p => ({ ...p, isAnonymous: true }))} /> Yes</label>
                <label><input type="radio" name="isAnonymous" checked={!formData.isAnonymous} onChange={() => setFormData(p => ({ ...p, isAnonymous: false }))} /> No</label>
              </div>
              <button type="submit" className="submit-btn-video">Post</button>
            </form>
          </div>
        </div>
      )}

      {/* video card display */}
      <div className="video-grid">
        {currentVideos.map(video => (
          <div key={video._id} className="video-card">
            <div className="video-title">
              <strong>{video.title}</strong>
              <div className="video-subtitle">{video.artist} — {video.songName}</div>
            </div>

            <div className="video-header">
              <img
                src={video.isAnonymous ? '/default-avatar.jpg' : video.user?.profileImage || '/default-avatar.jpg'}
                alt="User"
                className="video-avatar"
              />
              <span>{video.isAnonymous ? 'Anonymous' : video.user?.name}</span>
            </div>

            <video src={video.url} controls className="video-element" />

            <div className="video-description" onClick={() => setExpandedVideo(expandedVideo === video._id ? null : video._id ?? null)}>
              <span className="description-label">Description</span>
              <div className={`description-content ${expandedVideo === video._id ? 'expanded' : ''}`}>
                <p className="description-text">{video.description}</p>
                <div className="video-tuning">Tuning: {video.tuning}</div>
              </div>
            </div>

            {/* delete button shown only for user's own videos */}
            {video.user?._id === currentUserId && video._id && (
              <button onClick={() => handleDelete(video._id!)} className="delete-button">Delete</button>
            )}
          </div>
        ))}
      </div>

      {/* pagination controls */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: '0 5px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: currentPage === i + 1 ? '#5e3b9b' : '#4d3577',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Videos;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './videos.css';

// interface VideoUser {
//   _id: string;
//   name: string;
//   profileImage?: string;
// }

// interface Video {
//   _id?: string;
//   title: string;
//   artist: string;
//   songName: string;
//   tuning: string;
//   description: string;
//   url: string;
//   isAnonymous: boolean;
//   type: string;
//   user?: VideoUser;
// }

// const Videos: React.FC = () => {
//   const [formData, setFormData] = useState<Omit<Video, 'url'>>({
//     title: '', artist: '', songName: '', tuning: '', description: '', isAnonymous: false, type: 'Tutorial',
//   });
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState('All');
//   const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
//   const currentUserId = localStorage.getItem("userId");

//   const fetchVideos = async () => {
//     try {
//       const res = await axios.get('/api/videos');
//       setVideos(res.data);
//     } catch (err) {
//       console.error('Error fetching videos:', err);
//     }
//   };

//   useEffect(() => { fetchVideos(); }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!videoFile) return alert('Please upload a video file');

//     const form = new FormData();
//     Object.entries(formData).forEach(([key, value]) => form.append(key, String(value)));
//     form.append('videoFile', videoFile);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('/api/videos', form, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setFormData({ title: '', artist: '', songName: '', tuning: '', description: '', isAnonymous: false, type: 'Tutorial' });
//       setVideoFile(null);
//       setShowModal(false);
//       fetchVideos();
//     } catch (err) {
//       console.error('Upload error:', err);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`/api/videos/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setVideos(videos.filter(video => video._id !== id));
//     } catch (err) {
//       console.error('Delete failed:', err);
//     }
//   };

//   const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.type === filter);

//   return (
//     <div className="videos-page">
//       <div className="top-controls">
//         <button className="post-toggle" onClick={() => setShowModal(true)}>Post Video</button>
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Tutorial">Tutorial</option>
//           <option value="Cover">Cover</option>
//         </select>
//       </div>

//       {showModal && (
//         <div className="modal-overlay-video" onClick={() => setShowModal(false)}>
//           <div className="modal-video" onClick={e => e.stopPropagation()}>
//             <form className="upload-form" onSubmit={handleSubmit}>
//               <input name="title" placeholder="Add Video Title" value={formData.title} onChange={handleChange} required />
//               <input name="artist" placeholder="Add Artist name" value={formData.artist} onChange={handleChange} />
//               <input name="songName" placeholder="Add Song name" value={formData.songName} onChange={handleChange} />
//               <input name="tuning" placeholder="Add Tuning" value={formData.tuning} onChange={handleChange} />
//               <textarea name="description" placeholder="Add Description" value={formData.description} onChange={handleChange} />
//               <select name="type" value={formData.type} onChange={handleChange}>
//                 <option value="Tutorial">Tutorial</option>
//                 <option value="Cover">Cover</option>
//               </select>
//               <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} required />
//               <div className="anon-toggle">
//                 <span>Post anonymous</span>
//                 <label><input type="radio" name="isAnonymous" checked={formData.isAnonymous} onChange={() => setFormData(p => ({ ...p, isAnonymous: true }))} /> Yes</label>
//                 <label><input type="radio" name="isAnonymous" checked={!formData.isAnonymous} onChange={() => setFormData(p => ({ ...p, isAnonymous: false }))} /> No</label>
//               </div>
//               <button type="submit" className="submit-btn-video">Post</button>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="video-grid">
//         {filteredVideos.map(video => (
//             <div key={video._id} className="video-card">
//                 <div className="video-title">
//                     <strong>{video.title}</strong>
//                     <div className="video-subtitle">{video.artist} — {video.songName}</div>
//                 </div>

//                 {/* User display */}
//                 <div className="video-header">
//                     <img
//                     src={
//                         video.isAnonymous
//                         ? '/default-avatar.jpg'
//                         : video.user?.profileImage || '/default-avatar.jpg'
//                     }
//                     alt="User"
//                     className="video-avatar"
//                     />
//                     <span>{video.isAnonymous ? 'Anonymous' : video.user?.name}</span>
//                 </div>

//                 {/* Video player */}
//                 <video src={video.url} controls className="video-element" />

//                 {/* Description toggle */}
//                 <div className="video-description" onClick={() => setExpandedVideo(expandedVideo === video._id ? null : video._id ?? null)}>
//                     <span className="description-label">Description</span>

//                     <div className={`description-content ${expandedVideo === video._id ? 'expanded' : ''}`}>
//                     <p className="description-text">{video.description}</p>
//                     <div className="video-tuning">Tuning: {video.tuning}</div>
//                     </div>
//                 </div>

//                 {/* Delete Button */}
//                 {video.user?._id === currentUserId && video._id && (
//                     <button onClick={() => handleDelete(video._id!)} className="delete-button">Delete</button>
//                 )}
//                 </div>

//         ))}
//       </div>
//     </div>
//   );
// };

// export default Videos;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './videos.css';
import API_BASE_URL from './conifg'; // Adjust path as needed

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
  const [formData, setFormData] = useState<Omit<Video, 'url'>>({
    title: '', artist: '', songName: '', tuning: '', description: '', isAnonymous: false, type: 'Tutorial',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const currentUserId = localStorage.getItem("userId");

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos`);
      console.log("Videos API response:", res.data);

      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        console.error("Unexpected video response format:", res.data);
        setVideos([]); // Fallback to prevent crash
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

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
      console.error('Upload error:', err);
    }
  };

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

  const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.type === filter);

  return (
    <div className="videos-page">
      <div className="top-controls">
        <button className="post-toggle" onClick={() => setShowModal(true)}>Post Video</button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Cover">Cover</option>
        </select>
      </div>

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

      <div className="video-grid">
        {filteredVideos.map(video => (
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

            <div className="video-description" onClick={() => setExpandedVideo(expandedVideo === video._id ? null : video._id ?? null)}>
              <span className="description-label">Description</span>
              <div className={`description-content ${expandedVideo === video._id ? 'expanded' : ''}`}>
                <p className="description-text">{video.description}</p>
                <div className="video-tuning">Tuning: {video.tuning}</div>
              </div>
            </div>

            {video.user?._id === currentUserId && video._id && (
              <button onClick={() => handleDelete(video._id!)} className="delete-button">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;

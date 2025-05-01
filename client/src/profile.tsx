import React, { useState, useEffect } from 'react';
import './profile.css';
import UserVideos from './userVideos';
import API_BASE_URL from "./config";
import RecentPosts from './components/recentPosts';
import type { Post } from './components/recentPosts'; 



const Profile: React.FC = () => {

  //checks which tab is active to switch between shown content 
  const [activeTab, setActiveTab] = useState<'videos' | 'posts' | 'likes'>('videos');

  // Load stored images for user profile
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  //state for liked posts
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  //fetch profile data 
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user data");
  
        const data = await response.json();
        if (data.name) setUsername(data.name);
        if (data.description) setDescription(data.description);

  
        //update state with correct image URLs
        if (data.profileImage) {
          setProfileImage(data.profileImage);
          localStorage.setItem("profileImage", data.profileImage);
        }
        if (data.bannerImage) {
          setBannerImage(data.bannerImage);
          localStorage.setItem("bannerImage", data.bannerImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);

  //handle image imploads for profile and banner
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
  
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append(type === "profile" ? "profileImage" : "bannerImage", file); // Use correct field name
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/auth/update-images`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,  // Include the Bearer token
        },
        body: formData,  // Send FormData
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Image Upload Failed:", errorMsg);
        return;
      }
  
      const data = await response.json();
      console.log("Image Updated Successfully:", data);
  
      if (type === "profile") {
        setProfileImage(data.user.profileImage);
        localStorage.setItem("profileImage", data.user.profileImage);
      }
      if (type === "banner") {
        setBannerImage(data.user.bannerImage);
        localStorage.setItem("bannerImage", data.user.bannerImage);
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  //save updated user description to the backend
  const handleDescriptionUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-description`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update");
  
      console.log("Description saved:", data.description);
    } catch (err) {
      console.error("Failed to save description:", err);
    }
  };
  
  //fetch liked posts when the "likes" tab is active
  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (activeTab !== 'likes') return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/liked`, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setLikedPosts(data);
      } catch (err) {
        console.error("Failed to load liked posts:", err);
      }
    };
    fetchLikedPosts();
  }, [activeTab]);
  
  
//main body, render profile UI
  return (
    <div className="profile-container">
      {/* Banner Section */}
      <label 
        className="profile-banner"
        style={{
            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
    >
        { !bannerImage && <h2>Upload Banner image</h2> } 
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} />
    </label>

      {/* Profile Info Section */}
      <div className="profile-info">
        <label 
            className="profile-picture"
            style={{
                backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
          { !profileImage && <h2>Upload image</h2> } 
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "profile")} />
        </label>
        
        <div className="profile-details">
          <h3>{username}</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionUpdate}
            placeholder="Add a description..."
            style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              resize: 'none',
              outline: 'none',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <div className={`profile-tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
          Videos
        </div>
        <div className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
          Posts
        </div>
        <div className={`profile-tab ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => setActiveTab('likes')}>
          Likes
        </div>
      </div>

      {/* Dynamic Content Based on Selected Tab */}
      <div className="profile-content">
        {activeTab === 'videos' && <UserVideos/>}
        {activeTab === 'posts' && <RecentPosts userId={localStorage.getItem("userId") || ''} />}
        {activeTab === 'likes' && <RecentPosts userId="liked" />}
        </div>
      </div>
  );
};

export default Profile;

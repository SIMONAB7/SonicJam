import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from './config';
import './profile.css';
import UserVideos from './userVideos';
import RecentPosts from './components/recentPosts'; // ✅ reuse component

const ViewProfile: React.FC = () => {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'posts'>('videos'); // ✅ tabs

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setIsFollowing(data.isFollowing || false);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleToggleFollow = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await fetch(`${API_BASE_URL}/api/auth/${endpoint}/${user._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFollowing(!isFollowing);
      setUser((prev: any) => ({
        ...prev,
        followersCount: prev?.followersCount
          ? isFollowing
            ? prev.followersCount - 1
            : prev.followersCount + 1
          : 1,
      }));

      const storedFollowing = localStorage.getItem('following');
      let updatedFollowing: string[] = storedFollowing ? JSON.parse(storedFollowing) : [];

      if (isFollowing) {
        updatedFollowing = updatedFollowing.filter(uid => uid !== user._id);
      } else {
        updatedFollowing.push(user._id);
      }

      localStorage.setItem("following", JSON.stringify(updatedFollowing));
      window.dispatchEvent(new Event("follow-updated"));
    } catch (error) {
      console.error("Follow/unfollow failed:", error);
    }
  };

  if (!user) return <div className="profile-container">Loading profile...</div>;

  return (
    <div className="profile-container">

      <div
        className="profile-banner"
        style={{
          backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="profile-info">
        <div
          className="profile-picture"
          style={{
            backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="profile-details">
          <h3>{user.name}</h3>
          <p>{user.description || "No description provided."}</p>

          <div className="follow-info">
            <span><strong>{user.followersCount ?? 0}</strong> Followers</span>
            <span><strong>{user.followingCount ?? 0}</strong> Following</span>
          </div>

          {user._id !== currentUserId && (
            <button
              className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
              onClick={handleToggleFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* ✅ Tabs */}
      <div className="profile-tabs">
        <div
          className={`profile-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </div>
        <div
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'videos' && <UserVideos userId={user._id} />}
        {activeTab === 'posts' && <RecentPosts userId={user._id} />}
      </div>
    </div>
  );
};

export default ViewProfile;

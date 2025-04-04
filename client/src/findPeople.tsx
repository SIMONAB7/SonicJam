import React, { useEffect, useState } from 'react';
import './findPeople.css';
import API_BASE_URL from './config';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
  bannerImage?: string;
}

const FindPeople: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [following, setFollowing] = useState<string[]>([]);
  const [followingReady, setFollowingReady] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load following from localStorage first
    const storedFollowing = localStorage.getItem('following');
    if (storedFollowing) {
      setFollowing(JSON.parse(storedFollowing));
    }

    fetchUsers();
    fetchCurrentUser();

    // Listen for follow updates from other components
    const handleFollowUpdate = () => {
      const updatedFollowing = localStorage.getItem('following');
      if (updatedFollowing) {
        setFollowing(JSON.parse(updatedFollowing));
      }
    };

    window.addEventListener('follow-updated', handleFollowUpdate);

    return () => {
      window.removeEventListener('follow-updated', handleFollowUpdate);
    };
  }, []);

  //search engine for users by username
  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Failed to fetch users:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await res.json();

      const userFollowing = Array.isArray(user.following)
        ? user.following.map((u: any) => u._id || u)
        : [];

      setFollowing(userFollowing);
      localStorage.setItem("following", JSON.stringify(userFollowing));
      setFollowingReady(true);
    } catch (error) {
      console.error("❌ Failed to fetch current user:", error);
      setFollowing([]);
      setFollowingReady(true);
    }
  };

  const toggleFollow = async (id: string, isFollowing: boolean) => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await fetch(`${API_BASE_URL}/api/auth/${endpoint}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      let updatedFollowing;
      if (isFollowing) {
        updatedFollowing = following.filter(uid => uid !== id);
      } else {
        updatedFollowing = [...following, id];
      }

      setFollowing(updatedFollowing);
      localStorage.setItem("following", JSON.stringify(updatedFollowing));
      window.dispatchEvent(new Event("follow-updated"));
    } catch (error) {
      console.error(`❌ Failed to ${isFollowing ? 'unfollow' : 'follow'} user:`, error);
    }
  };

  return (
    <div className="people-page">
      <h2 className="page-title">Find People</h2>

      <input
        type='text'
        className='search-bar-find-people'
        placeholder='Search users...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="people-grid">
        {!followingReady ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : (
          filteredUsers.map(user => {
            const isFollowing = following.includes(user._id);

            return (
              <div
                key={user._id}
                className="people-card"
                style={{
                  backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="overlay" />
                <div className="user-header">
                  <img
                    src={user.profileImage || '/default-avatar.jpg'}
                    className="user-avatar"
                    alt={user.name}
                  />
                  <span
                    className="user-name"
                    onClick={() => navigate(`/view-profile/${user._id}`)}
                  >
                    {user.name}
                  </span>
                </div>

                <button
                  className={`follow-button ${isFollowing ? 'unfollow' : 'follow'}`}
                  onClick={() => toggleFollow(user._id, isFollowing)}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FindPeople;
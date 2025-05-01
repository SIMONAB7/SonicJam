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
  //state hooks for user data, filtered results, and search query
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  //store the list of followed user IDs
  const [following, setFollowing] = useState<string[]>([]);
  const [followingReady, setFollowingReady] = useState<boolean>(false);
  //pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    //load followed users from localStorage and fetch data
    const storedFollowing = localStorage.getItem('following');
    if (storedFollowing) {
      setFollowing(JSON.parse(storedFollowing));
    }

    fetchUsers();
    fetchCurrentUser();

    //listen to follow updates from other parts of the platform
    const handleFollowUpdate = () => {
      const updatedFollowing = localStorage.getItem('following');
      if (updatedFollowing) {
        setFollowing(JSON.parse(updatedFollowing));
      }
    };

    window.addEventListener('follow-updated', handleFollowUpdate);
    return () => window.removeEventListener('follow-updated', handleFollowUpdate);
  }, []);

  //update filtered users when the search query changes
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset page on new search
  }, [searchQuery, users]);

  //fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  //fetch current user data to get their follwoing list
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
      console.error("Failed to fetch current user:", error);
      setFollowing([]);
      setFollowingReady(true);
    }
  };

  //loggle follow/unfollow for a user
  const toggleFollow = async (id: string, isFollowing: boolean) => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await fetch(`${API_BASE_URL}/api/auth/${endpoint}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedFollowing = isFollowing
        ? following.filter(uid => uid !== id)
        : [...following, id];

      setFollowing(updatedFollowing);
      localStorage.setItem("following", JSON.stringify(updatedFollowing));
      window.dispatchEvent(new Event("follow-updated"));
    } catch (error) {
      console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user:`, error);
    }
  };

  //pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let last: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last !== null) {
        if (i as number - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i as number - last !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      last = i as number;
    }

    return rangeWithDots;
  };

  return (
    <div className="people-page">
      <h2 className="page-title">Find People</h2>
      {/*search input */}
      <input
        type='text'
        className='search-bar-find-people'
        placeholder='Search users...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* grid of user cards */}
      <div className="people-grid">
        {!followingReady ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : (
          currentUsers.map(user => {
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

      {/* Pagination buttons*/}
      <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {getPageNumbers().map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              style={{
                margin: '4px',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: currentPage === page ? '#5e3b9b' : '#4d3577',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ) : (
            <span key={idx} style={{ margin: '6px 10px', color: '#ccc' }}>{page}</span>
          )
        )}
      </div>
    </div>
  );
};

export default FindPeople;

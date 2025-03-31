// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import API_BASE_URL from './conifg';
// import './viewProfile.css';


// const ViewProfile: React.FC = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const fetchUser = async () => {
//       const res = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setUser(data);
//     };

//     fetchUser();
//   }, [id]);

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="view-profile">
//       <img src={user.bannerImage || '/default-banner.jpg'} className="banner" />
//       <div className="profile-box">
//         <img src={user.profileImage || '/default-avatar.jpg'} className="avatar" />
//         <h2>{user.name}</h2>
//         <p>{user.description || "No description provided."}</p>
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import API_BASE_URL from './conifg';
// import './profile.css'; //  re-use existing profile styling
// import UserVideos from './userVideos';

// const ViewProfile: React.FC = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setUser(data);
//       } catch (error) {
//         console.error("Failed to fetch viewed user:", error);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   if (!user) return <div className="profile-container">Loading profile...</div>;

//   return (
//     <div className="profile-container">
//       {/* Banner */}
//       <div
//         className="profile-banner"
//         style={{
//           backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       />

//       {/* Profile Info */}
//       <div className="profile-info">
//         <div
//           className="profile-picture"
//           style={{
//             backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//           }}
//         />
//         <div className="profile-details">
//           <h3>{user.name}</h3>
//           <p>{user.description || "No description provided."}</p>
//         </div>
//       </div>

//       {/* Tabs and Content (Only show posts for now) */}
//       <div className="profile-tabs">
//         <div className="profile-tab active">Posts</div>
//       </div>

//       <div className="profile-content">
//         <UserVideos userId={user._id} />
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import API_BASE_URL from './conifg';
// import './profile.css';
// import UserVideos from './userVideos';

// const ViewProfile: React.FC = () => {
//   const { id } = useParams();
//   const currentUserId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   const [user, setUser] = useState<any>(null);
//   const [isFollowing, setIsFollowing] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setUser(data);
//         setIsFollowing(data.isFollowing || false);
//       } catch (error) {
//         console.error("Failed to fetch user profile:", error);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   const handleToggleFollow = async () => {
//     try {
//       const endpoint = isFollowing ? 'unfollow' : 'follow';
//       await fetch(`${API_BASE_URL}/api/auth/${endpoint}/${user._id}`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setIsFollowing(!isFollowing);
//       setUser((prev: any) => ({
//         ...prev,
//         followersCount: prev?.followersCount
//           ? isFollowing
//             ? prev.followersCount - 1
//             : prev.followersCount + 1
//           : 1,
//       }));
//     } catch (error) {
//       console.error("Follow/unfollow failed:", error);
//     }
//   };

//   if (!user) return <div className="profile-container">Loading profile...</div>;

//   return (
//     <div className="profile-container">
//       <div className="profile-info">
//         <div
//           className="profile-picture"
//           style={{
//             backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//           }}
//         />
//         <div className="profile-details">
//           <h3>{user.name}</h3>
//           <p>{user.description || "No description provided."}</p>

//           <div className="follow-info">
//             <span><strong>{user.followersCount ?? 0}</strong> Followers</span>
//             <span><strong>{user.followingCount ?? 0}</strong> Following</span>
//           </div>

//           {user._id !== currentUserId && (
//             <button
//               className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
//               onClick={handleToggleFollow}
//             >
//               {isFollowing ? 'Unfollow' : 'Follow'}
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="profile-tabs">
//         <div className="profile-tab active">Posts</div>
//       </div>

//       <div className="profile-content">
//         <UserVideos userId={user._id} />
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from './conifg';
import './profile.css';
import UserVideos from './userVideos';

const ViewProfile: React.FC = () => {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

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
  
      // Update isFollowing locally
      setIsFollowing(!isFollowing);
  
      // Update user object to show correct follower count
      setUser((prev: any) => ({
        ...prev,
        followersCount: prev?.followersCount
          ? isFollowing
            ? prev.followersCount - 1
            : prev.followersCount + 1
          : 1,
      }));
  
      // Update following list in localStorage (so findPeople sees it!)
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

      {/* ✅ Add the banner back here */}
      <div
        className="profile-banner"
        style={{
          backgroundImage: user.bannerImage ? `url(${user.bannerImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Profile Info */}
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

      <div className="profile-tabs">
        <div className="profile-tab active">Videos</div>
      </div>

      <div className="profile-content">
        <UserVideos userId={user._id} />
      </div>
    </div>
  );
};

export default ViewProfile;

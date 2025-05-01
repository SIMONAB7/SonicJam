import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import FindPeople from './findPeople';
import Music from './music';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './profile';
import Videos from './videos';
import ViewProfile from './viewProfile';
import RecentPosts from './components/recentPosts';
import PostModal from './components/postModal';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');//state to manage search query for music page
  const location = useLocation();//navigation handles to determine location
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); //state to control visibility of post modal
  const isAuthenticated = !!localStorage.getItem('token');//checks if the user is authenticated 

  //logout function - deletes authorisation token and redirects to login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      {/* redirect if not authenticated */}
      {!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register" && <Navigate to="/login" replace />}
      
      {/* header (Only Show if Not on Login/Register Page) */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <>
          <header className="header">
            <div className="logo">SonicJam</div>
            <div className="nav">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/find-people">Find People</Link></li>
                <li><Link to="/music">Music</Link></li>
                <li><Link to="/videos">Videos</Link></li>
                {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>}
              </ul>
            </div>
            {/*display search input on the music library page */}
            <div className="search">
              {location.pathname === '/music' && (
                <>
                  <input
                    type="text"
                    placeholder="Search for a song or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </>
              )}
            </div>
          </header>
          {location.pathname !== "/profile" && !location.pathname.startsWith("/view-profile") &&( // Hide Banner ONLY on Profile Page amd view-profile
          <div className="banner">
            <img
              src="/banner2.JPG"
              alt="Banner"
            />
          </div>
        )}
        </>
      )}

      {/* Main Content */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              {/* Left Sidebar */}
              <aside className="sidebar left-sidebar">
                <h3>SonicJam</h3>
                <div className="box"><Link to="/profile">My Profile</Link></div>
                <div className="box"><a href="#">Notifications</a></div>
                <div className="box"><a href="#">Messages</a></div>
                <div className="box"><a href="#">People</a></div>
              </aside>

              {/* Center Content */}
              <main className="center-content">
                <h1>Welcome to SonicJam</h1>
                <RecentPosts />

                {isAuthenticated && (
                  <button className="create-post-btn" onClick={() => setShowModal(true)}>+</button>
                )}
                {showModal && <PostModal onClose={() => setShowModal(false)} />}

              </main>
            </div>
          }
        />
        {/*other routes to pages */}
        <Route path="/find-people" element={<FindPeople />} />
        <Route path="/music" element={<Music searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}/>
        <Route path="/videos" element={<Videos />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/view-profile/:id" element={<ViewProfile />} />
      </Routes>

      {/* Footer (Only Show if Not on Login/Register Page) */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <footer className="footer">
          <p>© 2024 SonicJam. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;

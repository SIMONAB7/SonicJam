import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import FindPeople from './findPeople';
import Music from './music';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Detect the current route
  const location = useLocation();

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="logo">SonicJam</div>
        <div className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/find-people">Find People</Link></li>
            <li><Link to="/music">Music</Link></li>
            <li><Link to="/videos">Videos</Link></li>
          </ul>
        </div>
        <div className="search">
          {/* Conditionally render the search bar for the Music page */}
          {location.pathname === '/music' && (
            <>
              <input
                type="text"
                placeholder="Search for a song or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <button className='go-button'>Go</button> */}
            </>
          )}
        </div>
      </header>

      {/* Banner */}
      <div className="banner">
        <img
          src="https://www.freewebheaders.com/wp-content/gallery/arts-entertainment-size-800x200/colorful-music-notes-on-dark-purple-banner-background_size-800x200.jpg"
          alt="Banner"
        />
      </div>

      {/* Main Content */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              {/* Left Sidebar */}
              <aside className="sidebar left-sidebar">
                <h3>SonicJam</h3>
                <div className="box"><a href="#">My Profile</a></div>
                <div className="box"><a href="#">Notifications</a></div>
                <div className="box"><a href="#">Messages</a></div>
                <div className="box"><a href="#">People</a></div>
              </aside>

              {/* Center Content */}
              <main className="center-content">
                <h1>Welcome to SonicJam</h1>
                <p>content???</p>
              </main>

              {/* Right Sidebar */}
              <aside className="sidebar right-sidebar">
                <div className="login-box">
                  <h3>Log In</h3>
                  <input type="text" placeholder="Email" />
                  <input type="password" placeholder="Password" />
                  <button>Log In</button>
                </div>
                <div className="signup-box">
                  <h3>Sign Up</h3>
                  <button>Sign Up Now</button>
                </div>
              </aside>
            </div>
          }
        />
        <Route path="/find-people" element={<FindPeople />} />
        <Route
          path="/music"
          element={<Music searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        />
        <Route
          path="/videos"
          element={
            <div className="center-content">
              <h1>Videos</h1>
              <p>This is the Videos page.</p>
            </div>
          }
        />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 SonicJam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;


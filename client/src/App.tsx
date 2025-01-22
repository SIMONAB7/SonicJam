// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import './App.css'; // Ensure this path is correct
// import Testing from './testing';

// // const App: React.FC = () => {
// //     const [message, setMessage] = useState('');

// //     // Fetch data from the backend
// //     useEffect(() => {
// //         fetch('http://localhost:5000/api/data')
// //             .then((res) => res.json())
// //             .then((data) => setMessage(data[0]?.value || 'No data found.'))
// //             .catch((error) => {
// //                 console.error('Error fetching data:', error);
// //                 setMessage('Failed to fetch data.');
// //             });
// //     }, []);

// //     return (
// //         <Router>
// //             <nav className="navbar">
// //                 <ul className="navbar-list">
// //                     <li className="navbar-item">
// //                         <Link to="/">Home</Link>
// //                     </li>
// //                     <li className="navbar-item">
// //                         <Link to="/about">About</Link>
// //                     </li>
// //                     <li className="navbar-item">
// //                         <Link to="/contact">Contact</Link>
// //                     </li>
// //                 </ul>
// //             </nav>

// //             <Routes>
// //                 <Route
// //                     path="/"
// //                     element={
// //                         <div className="App">
// //                             <header>
// //                                 <h1>Welcome to SonicJam!</h1>
// //                                 <p>{message ? `Backend says: ${message}` : 'Loading...'}</p>
// //                             </header>
// //                         </div>
// //                     }
// //                 />
// //                 <Route
// //                     path="/about"
// //                     element={
// //                         <div className="App">
// //                             <header>
// //                                 <h1>About SonicJam</h1>
// //                                 <p>This is the about page.</p>
// //                             </header>
// //                         </div>
// //                     }
// //                 />
// //                 <Route
// //                     path="/contact"
// //                     element={
// //                         <div className="App">
// //                             <header>
// //                                 <h1>Contact Us</h1>
// //                                 <p>This is the contact page.</p>
// //                             </header>
// //                         </div>
// //                     }
// //                 />
// //             </Routes>
// //         </Router>
// //     );
// // };

// const App: React.FC = () => {
//     return (
//         <Router>
//             <div className="App">
//                 {/* Header */}
//                 <header className="header">
//                     <div className="logo">SonicJam</div>
//                     <div className="nav">
//                         <ul>
//                             <li><a href="/">Home</a></li>
//                             <li><Link to="/find-people">Find People</Link></li>
//                             <li><a href="/music">Music</a></li>
//                             <li><a href="/videos">Videos</a></li>
//                         </ul>
//                     </div>
//                     <div className="search">
//                         <input type="text" placeholder="Search"/>
//                         <button>Go</button>
//                     </div>
//                 </header>

//                 {/* Define Routes */}
//                 <Routes>
//                     {/* Home Page */}
//                     <Route path="/" element={
//                         <div>
//                             <h1>Welcome to SonicJam!</h1>
//                             <p>This is the home page.</p>
//                         </div>
//                     } />
//                     {/* Find People Page */}
//                     <Route path="/find-people" element={<Testing />} />
//                     {/* Music Page */}
//                     <Route path="/music" element={
//                         <div>
//                             <h1>Music</h1>
//                             <p>This is the Music page.</p>
//                         </div>
//                     } />
//                     {/* Videos Page */}
//                     <Route path="/videos" element={
//                         <div>
//                             <h1>Videos</h1>
//                             <p>This is the Videos page.</p>
//                         </div>
//                     } />
//                 </Routes>

//                 {/* Banner */}
//                 <div className="banner">
//                     <img
//                         src="https://www.freewebheaders.com/wp-content/gallery/arts-entertainment-size-800x200/colorful-music-notes-on-dark-purple-banner-background_size-800x200.jpg"
//                         alt="Banner"
//                     />
//                 </div>

//                 {/* Main Content */}
//                 <div className="main-content">
//                     {/* Left Sidebar */}
//                     <aside className="sidebar left-sidebar">
//                         <h3>SonicJam</h3>
//                         <div className="box"><a href="#">My Profile</a></div>
//                         <div className="box"><a href="#">Notifications</a></div>
//                         <div className="box"><a href="#">Messages</a></div>
//                         <div className="box"><a href="#">People</a></div>
//                     </aside>

//                     {/* Center Content */}
//                     <main className="center-content">
//                         <h1>Welcome to SonicJam</h1>
//                         <p>content???</p>
//                     </main>

//                     {/* Right Sidebar */}
//                     <aside className="sidebar right-sidebar">
//                         <div className="login-box">
//                             <h3>Log In</h3>
//                             <input type="text" placeholder="Email" />
//                             <input type="password" placeholder="Password" />
//                             <button>Log In</button>
//                         </div>
//                         <div className="signup-box">
//                             <h3>Sign Up</h3>
//                             <button>Sign Up Now</button>
//                         </div>
//                     </aside>
//                 </div>

//                 {/* Footer */}
//                 <footer className="footer">
//                     <p>© 2024 SonicJam. All rights reserved.</p>
//                 </footer>
//             </div>
//         </Router>
//     );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FindPeople from './findPeople'; // Import the Find People page
import Music from './music';

const App: React.FC = () => {
  return (
    <Router>
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
            <input type="text" placeholder="Search" />
            <button>Go</button>
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
          <Route path="/music" element={<Music />} />
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
    </Router>
  );
};

export default App;

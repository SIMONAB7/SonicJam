// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
// import './App.css';
// import FindPeople from './findPeople';
// import Music from './music';
// import Login from './pages/Login';
// import Register from './pages/Register';

// const App: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const location = useLocation();//find current location
//   const navigate = useNavigate();//navigate to next location

//   const isAuthenticated = !!localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="App">
//       {/* Header */}
//       <header className="header">
//         <div className="logo">SonicJam</div>
//         <div className="nav">
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/find-people">Find People</Link></li>
//             <li><Link to="/music">Music</Link></li>
//             <li><Link to="/videos">Videos</Link></li>
//             {!isAuthenticated ? (
//               <>
//                 <li><Link to="/login">Login</Link></li>
//                 <li><Link to="/register">Register</Link></li>
//               </>
//             ) : (
//               <li><button onClick={handleLogout}>Logout</button></li>
//             )}
//           </ul>
//         </div>
//         <div className="search">
//           {/* Conditionally render the search bar for the Music page */}
//           {location.pathname === '/music' && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Search for a song or artist..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               {/* <button className='go-button'>Go</button> */}
//             </>
//           )}
//         </div>
//       </header>

//       {/* Banner */}
//       <div className="banner">
//         <img
//           src="https://www.freewebheaders.com/wp-content/gallery/arts-entertainment-size-800x200/colorful-music-notes-on-dark-purple-banner-background_size-800x200.jpg"
//           alt="Banner"
//         />
//       </div>

//       {/* Main Content */}
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content">
//               {/* Left Sidebar */}
//               <aside className="sidebar left-sidebar">
//                 <h3>SonicJam</h3>
//                 <div className="box"><a href="#">My Profile</a></div>
//                 <div className="box"><a href="#">Notifications</a></div>
//                 <div className="box"><a href="#">Messages</a></div>
//                 <div className="box"><a href="#">People</a></div>
//               </aside>

//               {/* Center Content */}
//               <main className="center-content">
//                 <h1>Welcome to SonicJam</h1>
//                 <p>content???</p>
//               </main>

//               {/* Right Sidebar */}
//               {!isAuthenticated ? (
//                 <aside className="sidebar right-sidebar">
//                   <div className="login-box">
//                     <h3>Log In</h3>
//                     <Link to="/login"><button>Log In</button></Link>
//                   </div>
//                   <div className="signup-box">
//                     <h3>Sign Up</h3>
//                     <Link to="/register"><button>Sign Up Now</button></Link>
//                   </div>
//                 </aside>
//               ) : (
//                 <aside className="sidebar right-sidebar">
//                   <h3>Welcome Back!</h3>
//                   <button onClick={handleLogout}>Logout</button>
//                 </aside>
//               )}
//             </div>
//           }
//         />
//         <Route path="/find-people" element={<FindPeople />} />
//         <Route
//           path="/music"
//           element={<Music searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
//         />
//         <Route
//           path="/videos"
//           element={
//             <div className="center-content">
//               <h1>Videos</h1>
//               <p>This is the Videos page.</p>
//             </div>
//           }
//         />
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//       </Routes>

//       {/* Footer */}
//       <footer className="footer">
//         <p>© 2024 SonicJam. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;


// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
// import './App.css';
// import FindPeople from './findPeople';
// import Music from './music';
// import Login from './pages/Login';
// import Register from './pages/Register';

// const App: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const isAuthenticated = !!localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="App">
//       {/* Redirect if not authenticated */}
//       {!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register" && <Navigate to="/login" replace />}
      
//       {/* Header */}
//       <header className="header">
//         <div className="logo">SonicJam</div>
//         <div className="nav">
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/find-people">Find People</Link></li>
//             <li><Link to="/music">Music</Link></li>
//             <li><Link to="/videos">Videos</Link></li>
//             {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>}
//           </ul>
//         </div>
//         <div className="search">
//           {location.pathname === '/music' && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Search for a song or artist..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </>
//           )}
//         </div>
//       </header>

//       {/* Banner */}
//       <div className="banner">
//         <img
//           src="https://www.freewebheaders.com/wp-content/gallery/arts-entertainment-size-800x200/colorful-music-notes-on-dark-purple-banner-background_size-800x200.jpg"
//           alt="Banner"
//         />
//       </div>

//       {/* Main Content */}
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content">
//               {/* Left Sidebar */}
//               <aside className="sidebar left-sidebar">
//                 <h3>SonicJam</h3>
//                 <div className="box"><a href="#">My Profile</a></div>
//                 <div className="box"><a href="#">Notifications</a></div>
//                 <div className="box"><a href="#">Messages</a></div>
//                 <div className="box"><a href="#">People</a></div>
//               </aside>

//               {/* Center Content */}
//               <main className="center-content">
//                 <h1>Welcome to SonicJam</h1>
//                 <p>content???</p>
//               </main>
//             </div>
//           }
//         />
//         <Route path="/find-people" element={<FindPeople />} />
//         <Route
//           path="/music"
//           element={<Music searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
//         />
//         <Route
//           path="/videos"
//           element={
//             <div className="center-content">
//               <h1>Videos</h1>
//               <p>This is the Videos page.</p>
//             </div>
//           }
//         />
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//       </Routes>

//       {/* Footer */}
//       <footer className="footer">
//         <p>© 2024 SonicJam. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;


import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import FindPeople from './findPeople';
import Music from './music';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './profile';
import Videos from './videos';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      {/* Redirect if not authenticated */}
      {!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register" && <Navigate to="/login" replace />}
      
      {/* Header (Only Show if Not on Login/Register Page) */}
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

          {/* Banner */}
          {/* <div className="banner">
            <img
              src="https://www.freewebheaders.com/wp-content/gallery/arts-entertainment-size-800x200/colorful-music-notes-on-dark-purple-banner-background_size-800x200.jpg"
              alt="Banner"
            />
          </div> */}
          {location.pathname !== "/profile" && ( // Hide Banner ONLY on Profile Page
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
                <p>content???</p>
              </main>
            </div>
          }
        />
        <Route path="/find-people" element={<FindPeople />} />
        <Route
          path="/music"
          element={<Music searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        />
        <Route path="/videos" element={<Videos />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
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

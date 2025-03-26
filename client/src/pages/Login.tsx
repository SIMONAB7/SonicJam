// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // If user is already logged in, redirect to home
//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       navigate('/');
//     }
//   }, [navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.msg || 'Login failed');

//       localStorage.setItem('token', data.token);
//       navigate('/');
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//         <button type="submit">Login</button>
//       </form>
//       <p>Don't have an account? <a href="/register">Sign up</a></p>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Ensure you have a CSS file for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });
  
  //     const data = await response.json();
  //     if (response.ok) {
  //       localStorage.setItem("token", data.token); // Save token for authentication
  //       console.log("Login Successful:", data);
  //       navigate("/"); // Redirect to home page
  //     } else {
  //       console.error("Login failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Login Successful:", data);
        navigate("/");
        // Store token 
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        // Redirect or refresh page to trigger profile fetch
        window.location.reload();
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };  
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Welcome to SonicJam!</h1>
        {/* <h2 className="tagline">Join us today</h2> */}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="signup-text">Don't have an account? <a href="/register">Join us today!</a></p>
      </div>
    </div>
  );
};

export default Login;


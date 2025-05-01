import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import API_BASE_URL from "../config";

const Login = () => {
  //state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //form submit handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //make request to login endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        //on success, store token and user ID in localStorage
        console.log("Login Successful:", data);
        navigate("/");
        // store token 
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        // redirect or refresh page to trigger profile fetch
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
        {/* login form */}
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
        {/* link to register page if user does not have account */}
        <p className="signup-text">Don't have an account? <a href="/register">Join us today!</a></p>
      </div>
    </div>
  );
};

export default Login;


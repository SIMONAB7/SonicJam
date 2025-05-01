import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // reuse the same CSS as Login for styling consistency
import API_BASE_URL from "../config";

const Register: React.FC = () => {
  //form state for user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //form submit handler for registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="tagline">Create Your SonicJam account</h2>
        {/* registration form */}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
        {/* link to existing account - login page */}
        <p className="signup-text">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;

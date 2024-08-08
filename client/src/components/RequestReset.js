import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/request-reset",
        { email }
      );
      if (response.data.success) {
        setMessage("Password reset email sent. Check your inbox.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred while requesting password reset.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Request Password Reset</h2>
      <form onSubmit={handleRequestReset}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Request Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestReset;

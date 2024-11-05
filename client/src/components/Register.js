import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  // Password regex pattern (enforces minimum length of 8, uppercase, lowercase, digit, special char)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_+\-={};':"\\|,.<>?]{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    // Ensure email and password are provided
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    // Validate password with regex
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return; // Prevent submission if password is invalid
    }

    try {
      // Send registration request to the backend
      const response = await axios.post("http://localhost:3001/auth/register", {
        email,
        password,
      });

      // Check for successful registration
      if (response.data.success) {
        setMessage("Registration successful. You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect to login after 2 seconds
      } else {
        setMessage(response.data.message); // Show error message if registration fails
      }
    } catch (error) {
      // Handle potential errors during the request
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="container mt-5 card">
      <h2 className="text-center mb-4 p-3">Register</h2>
      <form onSubmit={handleRegister} className="w-50 mx-auto p-3">
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"} // Toggle between password and text visibility
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary" // Styling for the visibility button
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              aria-label="Toggle password visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {message && (
        <p className="text-center mt-3 alert alert-info">{message}</p>
      )}
    </div>
  );
};

export default Register;

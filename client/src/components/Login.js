import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setShowOtpField(true);
        alert("OTP sent to your email. Check your inbox.");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("An error occurred during login");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const otpResponse = await axios.post(
        "http://localhost:3001/auth/verify-otp",
        {
          otp,
        }
      );

      if (otpResponse.data.success) {
        alert("OTP Verified. User logged in.");
        navigate("/weather"); // Redirect to Weather component on successful OTP verification
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      alert("An error occurred during OTP verification");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {showOtpField && (
                <div className="form-group">
                  <label>OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-block mt-3"
                    onClick={handleOtpVerification}
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              <button
                className="btn btn-primary btn-block mt-3"
                onClick={handleLogin}
              >
                Login
              </button>

              <div className="text-center mt-3">
                <a href="/request-reset" className="btn btn-link">
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB with connection pooling
mongoose.connect("mongodb://127.0.0.1:27017/mfa-mern");

// Define User model
const User = mongoose.model("User", {
  email: String,
  password: String,
  otp: String,
});

// Function to send OTP to the user's email
async function sendOtpEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send password reset email
async function sendResetEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `To reset your password, please click the following link: ${resetUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent: " + info.response);
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
}

// Registration endpoint
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
});

// Login endpoint
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const generatedOtp = randomize("0", 6);
    user.otp = generatedOtp;
    await user.save();

    await sendOtpEmail(email, generatedOtp);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
});

// OTP Verification endpoint
app.post("/auth/verify-otp", async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = "";
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification",
    });
  }
});

// Request Password Reset endpoint
app.post("/auth/request-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    const token = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    await sendResetEmail(email, token);

    return res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Error requesting password reset:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while requesting password reset",
    });
  }
});

// Reset Password endpoint
app.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password successfully updated",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

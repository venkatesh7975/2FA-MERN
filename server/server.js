const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const randomize = require("randomatic");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB with connection pooling
mongoose.connect("mongodb://127.0.0.1:27017/mfa-mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // poolSize: 10,
});

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

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email, password });
    console.log(user);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

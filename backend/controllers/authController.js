import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOTP.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { name, dob, email } = req.body;

  try {
    if (!name || !dob || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await UserModel.updateOne(
      { email },
      {
        $set: {
          otp: {
            code: otpCode,
            expiresAt: otpExpires,
          },
          name,
          dob,
          email,
          isVerified: false,
        },
      },
      { upsert: true }
    );

    // send email with OTP
    await sendOtpEmail(email, otpCode);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Failed to create user", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "User not found or not verified. Please sign up first.",
      });
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = {
      code: otpCode,
      expiresAt: otpExpires,
    };

    await user.save();

    await sendOtpEmail(email, otpCode);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and OTP",
      });
    }

    // 2. Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check if OTP matches
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 4. Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // 5. OTP is valid → update user
    user.isVerified = true;
    user.otp = {};
    await user.save();

    // 6. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Return success with token
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        name: user.name,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// google auth
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Verify the token from Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    if (!email || !name || !sub) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Google credentials",
      });
    }

    // 2. Try to find user
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name: name,
        email,
        dob: null,
        googleId: sub,
        isVerified: true,
        // Clear any existing OTP data
        otp: {
          code: undefined,
          expiresAt: undefined,
        },
      });
    } else {
      if (!user.googleId) {
        user.googleId = sub;
        user.isVerified = true;

        user.otp = {
          code: undefined,
          expiresAt: undefined,
        };
        await user.save();
      }
    }

    // 3. Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google auth successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        isVerified: user.isVerified,
        hasGoogleAuth: !!user.googleId,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Google login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Find user from token (req.user is set by protect middleware)
    const user = await UserModel.findById(req.user.id).select("-password -__v");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Update logged-in user's Date of Birth
 * @route PUT /auth/dob
 * @access Private
 */
export const updateDob = async (req, res) => {
  try {
    const { dob } = req.body;

    // Validate DOB
    if (!dob) {
      return res.status(400).json({ message: "Date of birth is required" });
    }

    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Optional: Prevent future dates
    const today = new Date();
    if (parsedDob > today) {
      return res.status(400).json({ message: "DOB cannot be in the future" });
    }

    // Update user DOB
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id, // from authMiddleware
      { dob: parsedDob },
      { new: true, select: "-password -googleId" } // hide sensitive fields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Date of birth updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating DOB:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

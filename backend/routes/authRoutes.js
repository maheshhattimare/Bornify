import express from "express";
import {
  login,
  signup,
  verifyOtp,
  googleLogin,
  getMe,
  updateDob,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.post("/verify-otp", verifyOtp);

router.get("/me", authMiddleware, getMe);

router.put("/dob", authMiddleware, updateDob);

export default router;

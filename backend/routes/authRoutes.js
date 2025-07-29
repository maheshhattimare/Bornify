import express from "express";
import {
  login,
  signup,
  verifyOtp,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.post("/verify-otp", verifyOtp);

export default router;

// routes/birthdayRoutes.js
import express from "express";
import {
  addBirthday,
  getBirthdays,
  updateBirthday,
  deleteBirthday,
} from "../controllers/birthdayController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Protected routes → must be logged in
router.get("/", authMiddleware, getBirthdays);
router.post("/", authMiddleware, upload.single("avatar"), addBirthday);
router.put("/:id", authMiddleware, upload.single("avatar"), updateBirthday);
router.delete("/:id", authMiddleware, deleteBirthday);

export default router;

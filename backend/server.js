// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import birthdayRoutes from "./routes/birthdayRoutes.js";
import { runBirthdayReminders } from "./jobs/cronJob.js"; // Import the function

const PORT = process.env.PORT || 3000;
const allowedOrigins = ["https://bornify.vercel.app"];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

// This connects to the DB when the server starts
connectDB();

// --- ROUTES ---
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// --- NEW SECURE CRON TRIGGER ENDPOINT ---
app.post("/api/cron/trigger", async (req, res) => {
  try {
    // Secure the endpoint with a secret key from environment variables
    const cronSecret = req.headers['x-cron-secret'];
    if (cronSecret !== process.env.CRON_SECRET) {
      console.warn("⚠️ Unauthorized cron attempt detected.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Run the job and wait for its result
    console.log("✅ Authorized cron request received.");
    const result = await runBirthdayReminders();
    
    // Send a response based on the job's outcome
    if (result.success) {
      res.status(200).json({ message: "Cron job executed successfully.", details: result });
    } else {
      res.status(500).json({ message: "Cron job failed during execution.", details: result });
    }
  } catch (error) {
    console.error("❌ Fatal error in cron trigger endpoint:", error);
    res.status(500).json({ message: "An unexpected error occurred on the server." });
  }
});


app.use("/api/users", authRoutes);
app.use("/api/birthdays", birthdayRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
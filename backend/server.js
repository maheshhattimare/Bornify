import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import birthdayRoutes from "./routes/birthdayRoutes.js";

const PORT = process.env.PORT || 3000;
const allowedOrigins = ["https://bornify.vercel.app", "http://localhost:5173"];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you use cookies or auth headers
  })
);
app.use(helmet());
app.use(express.json());

connectDB();

// routes
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/api/users", authRoutes);
app.use("/api/birthdays", birthdayRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

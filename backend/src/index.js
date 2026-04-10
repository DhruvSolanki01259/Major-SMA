import express from "express";
import cors from "cors";

import "dotenv/config";

// DB
import { connectDB } from "./database/connectDB.js";

// Clerk Middleware
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const PORT = process.env.PORT || 8000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
// Public route
app.get("/", (req, res) => {
  res.send("Public Route");
});

// Protected route
app.get("/protected", ClerkExpressRequireAuth(), (req, res) => {
  res.json({
    message: "Protected data accessed",
    userId: req.auth.userId,
  });
});

// Run App
app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
  // connectDB();
});

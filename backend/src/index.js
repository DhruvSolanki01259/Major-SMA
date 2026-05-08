// Database Import
import { connectDB } from "./database/connectDB.js";

// Routes
import contentRoutes from "./routes/content.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

// Dependencies Import
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import passport from "./config/passport.js";
import session from "express-session";

// App Instance
const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Backend Running Test Port
app.get("/", (req, res) => {
  res.send(`Backend is running!!!`);
});

// API's
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/posts", postRoutes);

// App Run
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
  connectDB();
});

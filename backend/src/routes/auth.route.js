import passport from "passport";
import {
  getMe,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth,middleware.js";

import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

import { generateCookieAndSetToken } from "../utils/generateCookieAndSetToken.js";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      generateCookieAndSetToken(res, req.user._id);
      res.redirect(`${process.env.FRONTEND_URL}/profile`);
    } catch (error) {
      console.error("Google login error: ", error.message);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
  },
);

router.get(
  "/connect/twitter",
  protectRoute,
  (req, res, next) => {
    req.session.tempUserId = req.user._id;
    passport.authenticate("twitter", { 
      scope: ['users.read', 'tweet.read', 'tweet.write', 'offline.access'] 
    })(req, res, next);
  }
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/profile?error=twitter_failed" }),
  (req, res) => {
    delete req.session.tempUserId;
    res.redirect(`${process.env.FRONTEND_URL}/profile?success=twitter_connected`);
  }
);

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

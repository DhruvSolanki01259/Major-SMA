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

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

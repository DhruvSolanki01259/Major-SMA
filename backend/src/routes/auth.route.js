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

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     try {
//       const token = jwt.sign(
//         { id: req.user._id, email: req.user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" },
//       );
//       res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
//     } catch (error) {
//       console.error("Google login error: ", error.message);
//       res.redirect(`${process.env.FRONTEND_URL}/login/?error=google_failed`);
//     }
//   },
// );
// router.get("/me", protectRoute, (req, res) => {
//   res.status(200).json({ success: true, error: false });
// });

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

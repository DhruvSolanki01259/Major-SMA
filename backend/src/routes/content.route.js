import express from "express";
import { generateContentIdeas, generatePostContent } from "../controllers/content.controller.js";
import { protectRoute } from "../middlewares/auth,middleware.js";

const router = express.Router();

router.post("/generate", protectRoute, generateContentIdeas);
router.post("/generatePostContent", protectRoute, generatePostContent);

export default router;

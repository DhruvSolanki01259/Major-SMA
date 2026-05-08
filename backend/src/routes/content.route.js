import express from "express";
import { generateContentIdeas, generatePostContent } from "../controllers/content.controller.js";

const router = express.Router();

router.post("/generate", generateContentIdeas);
router.post("/generatePostContent", generatePostContent);

export default router;

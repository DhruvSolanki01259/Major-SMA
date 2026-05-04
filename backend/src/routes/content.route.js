import express from "express";
import { generateContentIdeas } from "../controllers/content.controller.js";

const router = express.Router();

router.post("/generate", generateContentIdeas);

export default router;

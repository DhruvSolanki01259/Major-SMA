import express from "express";
import { createPost, getPosts, updatePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/auth,middleware.js";

const router = express.Router();

router.post("/", protectRoute, createPost);
router.get("/", protectRoute, getPosts);
router.put("/:id", protectRoute, updatePost);

export default router;

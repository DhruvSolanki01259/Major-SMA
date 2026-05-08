import Post from "../models/post.model.js";
import openai from "../config/openai.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { appendPostToSheet } from "../utils/googleSheets.js";

export const createPost = async (req, res) => {
  try {
    const postData = req.body;
    postData.user = req.user._id;

    // ── Image upload: every platform image MUST land on Cloudinary ──────────
    const isCloudinaryUrl = (url) =>
      typeof url === "string" && url.includes("res.cloudinary.com");

    if (postData.platforms) {
      const platformEntries = Object.entries(postData.platforms);

      await Promise.all(
        platformEntries.map(async ([platformName, platformData]) => {
          if (!platformData || !platformData.imagePrompt) return;

          if (!postData.creative) postData.creative = { imageURLs: [] };
          if (!postData.creative.imageURLs) postData.creative.imageURLs = [];

          // Case 1: Already on Cloudinary
          if (platformData.mediaUrl && isCloudinaryUrl(platformData.mediaUrl)) {
            if (!postData.creative.imageURLs.includes(platformData.mediaUrl)) {
              postData.creative.imageURLs.push(platformData.mediaUrl);
            }
            return;
          }

          // Case 2 & 3: Generate or Upload to Cloudinary
          let sourceUrl = platformData.mediaUrl;

          if (!sourceUrl) {
            const colorContext = postData.creative?.imageColors?.length
              ? `Follow this specific color palette: ${postData.creative.imageColors.join(", ")}.`
              : "";
            const styleContext = postData.creative?.imageNotes
              ? `Incorporate these creative style notes: ${postData.creative.imageNotes}.`
              : "";
            const enrichedPrompt = `Digital art for social media. ${colorContext} ${styleContext} Subject: ${platformData.imagePrompt}`.trim();
            const seed = Math.floor(Math.random() * 1000000);
            sourceUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
          }

          console.log(`⬆️ Uploading image for [${platformName}] to Cloudinary...`);
          const cloudinaryUrl = await uploadImageToCloudinary(sourceUrl);

          if (!cloudinaryUrl) {
            throw new Error(`Cloudinary upload failed for platform: ${platformName}. Post not saved.`);
          }

          platformData.mediaUrl = cloudinaryUrl;
          postData.creative.imageURLs.push(cloudinaryUrl);
          console.log(`✅ Cloudinary upload success for [${platformName}]: ${cloudinaryUrl}`);
        })
      );
    }

    const newPost = new Post(postData);
    await newPost.save();

    // Mirror the saved post to Google Sheets (non-blocking)
    await appendPostToSheet({
      postId: newPost._id,
      niche: newPost.niche,
      selectedIdea: newPost.selectedIdea,
      selectedPlatforms: postData.selectedPlatforms || [],
      creative: newPost.creative,
      platforms: newPost.platforms,
      status: newPost.status,
    });

    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error("❌ CREATE POST ERROR:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to save post",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("❌ GET POSTS ERROR:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch posts",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await Post.findOne({ _id: id, user: req.user._id });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If already approved, prevent changes
    if (post.status === "approved") {
      return res.status(400).json({ error: "Approved posts cannot be modified" });
    }

    // Update the post
    Object.assign(post, updateData);
    await post.save();

    // If status changed to approved, update Google Sheet one final time
      if (updateData.status === "approved") {
        await appendPostToSheet({
          postId: post._id,
          niche: post.niche,
          selectedIdea: post.selectedIdea,
          selectedPlatforms: post.selectedPlatforms || [],
          creative: post.creative,
          platforms: post.platforms,
          status: post.status,
        });
      }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

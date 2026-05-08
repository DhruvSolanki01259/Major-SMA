import openai from "../config/openai.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const generateContentIdeas = async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche) {
      return res.status(400).json({ error: "Niche is required" });
    }

    const prompt = `Generate exactly 3 viral social media ideas about ${niche}. Return ONLY JSON array.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Always return a valid JSON array with exactly 3 items. No explanation, no text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    let content = response.choices[0].message.content;

    // Clean markdown if model adds it
    content = content.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw: content,
      });
    }

    // Ensure exactly 3 ideas
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      return res.status(500).json({
        error: "AI did not return exactly 3 ideas",
        data: parsed,
      });
    }

    res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content ideas" });
  }
};

export const generatePostContent = async (req, res) => {
  try {
    const { niche, selectedIdea, platforms, imageNotes, imageColors } = req.body;

    if (!niche || !selectedIdea || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ error: "niche, selectedIdea, and platforms array are required" });
    }

    const platformList = platforms.join(", ");
    const colorStr = Array.isArray(imageColors) ? imageColors.join(", ") : "vibrant";
    
    const prompt = `You are an expert social media manager.
Create a highly engaging post for a client in the "${niche}" niche.
The core idea of the post is: "${selectedIdea}".

The client wants to post this on the following platforms: ${platformList}.

For each platform, you need to generate:
1. The text content of the post (optimized for that specific platform's style and audience).
2. Relevant hashtags.
3. An image generation prompt (highly descriptive) that would create a perfect accompanying image. 
   - Mandatory Color Palette: ${colorStr}
   - Style Instructions: ${imageNotes || 'modern, professional, eye-catching'}
   - Focus: The image should visually represent the "${selectedIdea}" concept while strictly adhering to the colors and style requested.

Return ONLY a valid JSON object where keys are the platform names (lowercase) and values are objects with "text", "hashtags" (array of strings), and "imagePrompt" (string).
No explanation, no markdown formatting outside of the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a strict JSON generator. Always return a valid JSON object. No explanation, no text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({ error: "Invalid JSON from AI", raw: content });
    }

    // PARTIAL IMAGE GENERATION: Generate images for the first 2 platforms immediately
    const platformKeys = Object.keys(parsed);
    const platformsToPreGenerate = platformKeys.slice(0, 2);

    await Promise.all(
      platformsToPreGenerate.map(async (pName) => {
        const pData = parsed[pName];
        if (pData && pData.imagePrompt) {
          try {
            const colorContext = Array.isArray(imageColors) ? `Follow this specific color palette: ${imageColors.join(", ")}.` : "";
            const styleContext = imageNotes ? `Incorporate these creative style notes: ${imageNotes}.` : "";
            const enrichedPrompt = `Digital art for social media. ${colorContext} ${styleContext} Subject: ${pData.imagePrompt}`.trim();
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
            
            const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);
            pData.mediaUrl = cloudinaryUrl || imageUrl;
          } catch (err) {
            console.error(`Error pre-generating image for ${pName}:`, err.message);
          }
        }
      })
    );

    res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("Error generating post content:", error);
    res.status(500).json({ error: "Failed to generate post content" });
  }
};

// import model from "../config/gemini.js";

// export const generateContentIdeas = async (req, res) => {
//   try {
//     const { niche } = req.body;

//     if (!niche) {
//       return res.status(400).json({ error: "Niche is required" });
//     }

//     const prompt = `
// Generate exactly 3 viral social media ideas about ${niche}.

// Return ONLY a valid JSON array.
// Example:
// ["Idea 1", "Idea 2", "Idea 3"]

// NO explanation. NO markdown.
// `;

//     const result = await model.generateContent(prompt);

//     let content = result.response.text().trim();

//     // Clean unwanted markdown if any
//     content = content.replace(/```json|```/g, "").trim();

//     let parsed;
//     try {
//       parsed = JSON.parse(content);
//     } catch (err) {
//       return res.status(500).json({
//         error: "Invalid JSON from Gemini",
//         raw: content,
//       });
//     }

//     if (!Array.isArray(parsed) || parsed.length !== 3) {
//       return res.status(500).json({
//         error: "Gemini did not return exactly 3 ideas",
//         data: parsed,
//       });
//     }

//     res.json({
//       success: true,
//       data: parsed,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Failed to generate content ideas",
//     });
//   }
// };

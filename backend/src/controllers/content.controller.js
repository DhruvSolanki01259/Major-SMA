import openai from "../config/openai.js";

export const generateContentIdeas = async (req, res) => {
  try {
    const { niche } = req.body;

    if (!niche) {
      return res.status(400).json({ error: "Niche is required" });
    }

    const prompt = `Generate exactly 3 viral social media ideas about ${niche}. Return ONLY JSON array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
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

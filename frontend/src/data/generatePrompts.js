export const generatePrompts = ({ niche, selectedIdea, creative }) => {
  const baseContext = ``;

  return {
    twitter: {
      text: `${baseContext}

      Write a viral Twitter (X) post:
      - Max 280 characters
      - Strong hook in first line
      - Concise and punchy
      - Use 2–4 relevant hashtags
      - No fluff

      Output ONLY the final tweet text.
      `,

      image: `${baseContext}

      Generate an image prompt for Twitter:
      - Clean, minimal, scroll-stopping
      - High contrast
      - Include short bold text overlay (max 6 words)

      Return ONLY the image generation prompt.
      `,
    },

    facebook: {
      text: `${baseContext}

      Write a Facebook post:
      - Engaging storytelling style
      - 2–3 short paragraphs
      - Add a question or CTA at the end
      - Include 3–5 hashtags

      Output ONLY the final post text.
      `,

      image: `${baseContext}

      Generate an image prompt for Facebook:
      - Relatable and emotional visual
      - Slightly detailed composition
      - Should connect with broad audience

      Return ONLY the image prompt.
      `,
    },

    instagram: {
      text: `${baseContext}

      Write an Instagram caption:
      - Hook in first line
      - Short engaging body
      - Line breaks for readability
      - Add CTA (save/share/comment)
      - Include 8–15 hashtags

      Output ONLY the caption.
      `,

      image: `${baseContext}

      Generate an Instagram image prompt:
      - Aesthetic, modern, highly visual
      - Focus on ${creative.imageColors?.join(", ") || "clean tones"}
      - Visually appealing composition for feed

      Return ONLY the image prompt.
      `,
    },

    linkedin: {
      text: `${baseContext}

      Write a LinkedIn post:
      - Professional and insightful tone
      - Start with a strong hook
      - Value-driven content
      - End with a thought-provoking question
      - Minimal hashtags (3–5)

      Output ONLY the post text.
      `,

      image: `${baseContext}

      Generate a LinkedIn image prompt:
      - Professional, clean, minimal
      - Subtle branding style
      - Corporate-friendly design

      Return ONLY the image prompt.
      `,
    },
  };
};

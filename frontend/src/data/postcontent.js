export const postContent = {
  // --- CORE IDEA ---
  niche: "",
  selectedIdea: "",

  // --- CREATIVE INPUTS ---
  creative: {
    imageColors: [],
    imageNotes: "",
  },

  // --- AI PROMPTS ---
  prompts: {
    twitter: {
      text: "",
      image: "",
    },
    facebook: {
      text: "",
      image: "",
    },
    instagram: {
      text: "",
      image: "",
    },
    linkedin: {
      text: "",
      image: "",
    },
  },

  // --- GENERATED CONTENT PER PLATFORM ---
  platforms: {
    twitter: {
      text: "",
      hashtags: [],
      media: {
        url: "",
        type: "image",
      },
    },

    facebook: {
      text: "",
      hashtags: [],
      media: {
        url: "",
        type: "image",
      },
    },

    instagram: {
      text: "",
      hashtags: [],
      media: {
        url: "",
        type: "image",
      },
    },

    linkedin: {
      text: "",
      hashtags: [],
      media: {
        url: "",
        type: "image",
      },
    },
  },

  // --- GLOBAL STATUS ---
  status: "draft", // draft → approved → scheduled → published → failed
};

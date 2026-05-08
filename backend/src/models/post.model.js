import mongoose from "mongoose";

const platformContentSchema = new mongoose.Schema(
  {
    content: {
      text: {
        type: String,
        default: "",
      },
      hashtags: {
        type: [String],
        default: [],
      },
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    imagePrompt: {
      type: String,
      default: "",
    }
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    niche: {
      type: String,
      required: true,
      trim: true,
    },

    selectedIdea: {
      type: String,
      required: true,
      trim: true,
    },

    creative: {
      imageColors: {
        type: [String],
        default: []
      },
      imageNotes: {
        type: String,
        default: ""
      },
      imageURLs: {
        type: [String],
        default: []
      }
    },

    selectedPlatforms: {
      type: [String],
      default: [],
    },

    platforms: {
      twitter: {
        type: platformContentSchema,
        required: false,
      },
      facebook: {
        type: platformContentSchema,
        required: false,
      },
      instagram: {
        type: platformContentSchema,
        required: false,
      },
      linkedin: {
        type: platformContentSchema,
        required: false,
      },
    },

    isScheduled: {
      type: Boolean,
      default: false
    },

    scheduledAt: {
      date: { type: String },
      time: { type: String }
    },

    status: {
      type: String,
      enum: ["draft", "approved", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export default mongoose.model("Post", postSchema);

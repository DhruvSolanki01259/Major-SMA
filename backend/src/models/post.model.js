import mongoose from "mongoose";

const platformContentSchema = new mongoose.Schema(
  {
    content: {
      text: {
        type: String,
        required: true,
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
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
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

    platforms: {
      twitter: {
        type: platformContentSchema,
        required: true,
      },

      facebook: {
        type: platformContentSchema,
        required: true,
      },

      instagram: {
        type: platformContentSchema,
        required: true,
        validate: {
          validator: function (value) {
            return value.mediaUrl && value.mediaUrl.length > 0;
          },
          message: "Instagram requires mediaUrl",
        },
      },

      linkedin: {
        type: platformContentSchema,
        required: true,
      },
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

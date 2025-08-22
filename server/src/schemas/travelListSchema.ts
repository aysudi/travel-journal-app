import { required } from "joi";
import mongoose from "mongoose";

const travelListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    visibility: {
      type: String,
      enum: ["private", "friends", "public"],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    autoPermissions: {
      friends: {
        type: String,
        enum: ["view", "suggest", "contribute"],
        default: "suggest",
      },
      followers: {
        type: String,
        enum: ["view", "suggest", "contribute"],
        default: "view",
      },
      public: {
        type: String,
        enum: ["view", "suggest", "contribute"],
        default: "view",
      },
    },

    customPermissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        level: {
          type: String,
          enum: ["view", "suggest", "contribute", "co-owner"],
          required: true,
        },
        grantedAt: {
          type: Date,
          default: Date.now,
        },
        grantedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    settings: {
      allowSuggestions: {
        type: Boolean,
        default: true,
      },
      requireApprovalForSuggestions: {
        type: Boolean,
        default: true,
      },
      notifyOnChanges: {
        type: Boolean,
        default: true,
      },
      allowFollowerSuggestions: {
        type: Boolean,
        default: false,
      },
    },

    coverImage: { type: String, required: true },
    public_id: { type: String },
    destinations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    ],

    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true, versionKey: false }
);

travelListSchema.index({ owner: 1 });
travelListSchema.index({ visibility: 1 });
travelListSchema.index({ tags: 1 });
travelListSchema.index({ title: "text", description: "text" });
travelListSchema.index({ "customPermissions.user": 1 });
travelListSchema.index({ owner: 1, visibility: 1 });

export default travelListSchema;

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: { type: Date, default: Date.now },
        leftAt: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
      },
    ],

    description: { type: String },

    avatar: { type: String },

    lastMessage: {
      message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
      timestamp: { type: Date },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      preview: { type: String },
    },

    messageCount: { type: Number, default: 0 },

    currentlyTyping: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        startedAt: { type: Date, default: Date.now },
      },
    ],

    pinnedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    archived: {
      isArchived: { type: Boolean, default: false },
      archivedAt: { type: Date },
      archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

chatSchema.index({ "members.user": 1, "members.isActive": 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ "lastMessage.timestamp": -1 });
chatSchema.index({ createdBy: 1 });
chatSchema.index({ "archived.isArchived": 1 });

chatSchema.index({
  "members.user": 1,
  "members.isActive": 1,
  "archived.isArchived": 1,
});

export default chatSchema;

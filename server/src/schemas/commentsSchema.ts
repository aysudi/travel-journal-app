import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, maxlength: 5000 },
    photos: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    journalEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalEntry",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

commentSchema.index({ journalEntry: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

export default commentSchema;

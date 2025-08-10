import mongoose from "mongoose";

const destinationSuggestionSchema = new mongoose.Schema(
  {
    destination: {
      name: { type: String, required: true },
      location: { type: String, required: true },
      datePlanned: { type: Date },
      notes: { type: String },
      images: [{ type: String }],
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelList",
      required: true,
    },
    suggestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: { type: Date },
    reviewNote: { type: String },
  },
  { timestamps: true, versionKey: false }
);

destinationSuggestionSchema.index({ list: 1, status: 1 });
destinationSuggestionSchema.index({ suggestedBy: 1 });
destinationSuggestionSchema.index({ reviewedBy: 1 });
destinationSuggestionSchema.index({ createdAt: -1 });

export default destinationSuggestionSchema;

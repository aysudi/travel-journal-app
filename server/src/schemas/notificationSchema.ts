import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      enum: [
        "message",
        "list_invite",
        "list_shared",
        "journal_like",
        "destination_added",
        "system",
        "reminder",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Related entities for context
    relatedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    relatedTravelList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelList",
    },
    relatedDestination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    relatedJournalEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalEntry",
    },
    // Action URL for frontend
    actionUrl: {
      type: String,
    },
    // Auto-delete after certain time
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  { timestamps: true, versionKey: false }
);

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default notificationSchema;

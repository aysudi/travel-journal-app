import mongoose from "mongoose";

const listInvitationSchema = new mongoose.Schema(
  {
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelList",
      required: true,
    },
    inviter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissionLevel: {
      type: String,
      enum: ["view", "suggest", "contribute", "co-owner"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true, versionKey: false }
);

listInvitationSchema.index({ invitee: 1, status: 1 });
listInvitationSchema.index({ list: 1 });
listInvitationSchema.index({ expiresAt: 1 });
listInvitationSchema.index({ inviter: 1 });

export default listInvitationSchema;

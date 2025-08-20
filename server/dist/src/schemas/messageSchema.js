import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    seenBy: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            seenAt: { type: Date, default: Date.now },
        },
    ],
    status: {
        type: String,
        enum: ["sent", "read"],
        default: "sent",
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelList",
        required: true,
    },
    edited: {
        isEdited: { type: Boolean, default: false },
        editedAt: { type: Date },
        originalContent: { type: String },
    },
    deleted: {
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
}, { timestamps: true, versionKey: false });
messageSchema.index({ list: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
export default messageSchema;

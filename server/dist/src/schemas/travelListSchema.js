import mongoose from "mongoose";
const travelListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
    },
    tags: [
        {
            type: String,
            trim: true,
            maxlength: 30,
        },
    ],
    isPublic: { type: Boolean, default: false },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    coverImage: { type: String },
    destinations: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    ],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
}, { timestamps: true, versionKey: false });
travelListSchema.index({ owner: 1 });
travelListSchema.index({ isPublic: 1 });
travelListSchema.index({ tags: 1 });
travelListSchema.index({ title: "text", description: "text" });
export default travelListSchema;

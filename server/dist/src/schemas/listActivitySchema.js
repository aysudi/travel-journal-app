import mongoose from "mongoose";
const listActivitySchema = new mongoose.Schema({
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelList",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        enum: [
            "added_destination",
            "edited_destination",
            "suggested_destination",
            "approved_suggestion",
            "rejected_suggestion",
            "joined_list",
            "left_list",
            "changed_permissions",
        ],
        required: true,
    },
    details: {
        destinationId: mongoose.Schema.Types.ObjectId,
        suggestionId: mongoose.Schema.Types.ObjectId,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });
listActivitySchema.index({ list: 1, createdAt: -1 });
listActivitySchema.index({ user: 1 });
listActivitySchema.index({ action: 1 });
listActivitySchema.index({ isPublic: 1 });
export default listActivitySchema;

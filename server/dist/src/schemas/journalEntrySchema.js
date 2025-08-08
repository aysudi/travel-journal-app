import mongoose from "mongoose";
const journalEntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    photos: [{ type: String }],
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    public: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
journalEntrySchema.index({ destination: 1 });
journalEntrySchema.index({ author: 1 });
journalEntrySchema.index({ public: 1 });
journalEntrySchema.index({ createdAt: -1 });
export default journalEntrySchema;

import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelList",
        required: true,
    },
}, { timestamps: true, versionKey: false });
// messageSchema.index({ list: 1, timestamp: -1 });
// messageSchema.index({ sender: 1 });
export default messageSchema;

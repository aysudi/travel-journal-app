import mongoose from "mongoose";
const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    datePlanned: { type: Date },
    dateVisited: { type: Date },
    status: {
        type: String,
        enum: ["Wishlist", "Planned", "Visited"],
        default: "Wishlist",
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    images: [{ type: String }],
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelList",
        required: true,
    },
}, { timestamps: true });
export default destinationSchema;

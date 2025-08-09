import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
    },
    datePlanned: { type: Date, default: null },
    dateVisited: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Wishlist", "Planned", "Visited"],
      default: "Wishlist",
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    images: [{ type: String }],
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelList",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

destinationSchema.set("toJSON", { virtuals: true });
destinationSchema.set("toObject", { virtuals: true });
destinationSchema.virtual("journalEntries", {
  ref: "JournalEntry",
  localField: "_id",
  foreignField: "destination",
});

destinationSchema.index({ list: 1 });
destinationSchema.index({ status: 1 });
destinationSchema.index({ location: 1 });
destinationSchema.index({ datePlanned: 1 });
destinationSchema.index({ dateVisited: 1 });

export default destinationSchema;

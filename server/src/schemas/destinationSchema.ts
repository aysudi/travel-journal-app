import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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
      maxlength: 1000,
    },
    images: [{ type: String }],
    listId: {
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

destinationSchema.index({ listId: 1 });
destinationSchema.index({ status: 1 });
destinationSchema.index({ country: 1 });
destinationSchema.index({ datePlanned: 1 });
destinationSchema.index({ dateVisited: 1 });

export default destinationSchema;

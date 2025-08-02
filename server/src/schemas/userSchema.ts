import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isVerified: {
      type: Boolean,
      default: function (this: any) {
        return this.provider !== "local";
      },
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    providerId: {
      type: String,
      default: null,
    },

    socketId: { type: String, default: null },

    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    premium: { type: Boolean, default: false },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelList" }],

    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
userSchema.virtual("journalEntries", {
  ref: "JournalEntry",
  localField: "_id",
  foreignField: "author",
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ isVerified: 1 });

export default userSchema;

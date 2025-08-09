import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    profileImage: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
    },

    public_id: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
      minlength: [6, "Password must be at least 6 characters long"],
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

    ownedLists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelList" }],
      default: [],
    },
    collaboratingLists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelList" }],
      default: [],
    },

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

userSchema.virtual("notifications", {
  ref: "Notification",
  localField: "_id",
  foreignField: "recipient",
  options: { sort: { createdAt: -1 } },
});

userSchema.virtual("allLists").get(function (this: any) {
  const ownedLists = Array.isArray(this.ownedLists) ? this.ownedLists : [];
  const collaboratingLists = Array.isArray(this.collaboratingLists)
    ? this.collaboratingLists
    : [];
  return [...ownedLists, ...collaboratingLists];
});

// Helper method to get user's role in all their travel lists
userSchema.methods.getAllListsWithRoles = async function () {
  const TravelList = mongoose.model("TravelList");

  // Get owned lists (user is Owner)
  const ownedLists = await TravelList.find({ owner: this._id })
    .select("title description isPublic createdAt")
    .lean();

  const ownedWithRoles = ownedLists.map((list) => ({
    ...list,
    role: "Owner",
  }));

  // Get collaborating lists (user has specific role)
  const collaboratingLists = await TravelList.find({
    "collaborators.user": this._id,
  })
    .select("title description isPublic createdAt collaborators")
    .lean();

  const collaboratingWithRoles = collaboratingLists.map((list) => {
    const collaborator = list.collaborators.find(
      (collab: any) => collab.user.toString() === this._id.toString()
    );
    return {
      _id: list._id,
      title: list.title,
      description: list.description,
      isPublic: list.isPublic,
      createdAt: list.createdAt,
      role: collaborator?.role || "Viewer",
    };
  });

  return [...ownedWithRoles, ...collaboratingWithRoles];
};

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ isVerified: 1 });

export default userSchema;

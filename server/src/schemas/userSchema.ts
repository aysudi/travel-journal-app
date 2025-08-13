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

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequestsReceived: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    friendRequestsSent: [
      {
        to: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

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
  return ownedLists;
});

userSchema.methods.getAllListsWithRoles = async function () {
  const TravelList = mongoose.model("TravelList");

  const ownedLists = await TravelList.find({ owner: this._id })
    .select("title description visibility createdAt")
    .lean();

  const ownedWithRoles = ownedLists.map((list) => ({
    ...list,
    role: "Owner",
  }));

  const collaboratingLists = await TravelList.find({
    "customPermissions.user": this._id,
  })
    .select("title description visibility createdAt customPermissions")
    .lean();

  const collaboratingWithRoles = collaboratingLists.map((list) => {
    const permission = list.customPermissions.find(
      (perm: any) => perm.user.toString() === this._id.toString()
    );
    return {
      _id: list._id,
      title: list.title,
      description: list.description,
      visibility: list.visibility,
      createdAt: list.createdAt,
      role: permission?.level || "view",
    };
  });

  return [...ownedWithRoles, ...collaboratingWithRoles];
};

// Friend-related methods
userSchema.methods.sendFriendRequest = async function (targetUserId: string) {
  const User = mongoose.model("User");
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  if (this.friends.includes(targetUserId)) {
    throw new Error("Already friends");
  }

  // Check if there's already a pending request
  if (
    this.friendRequestsSent.some(
      (req: any) => req.to.toString() === targetUserId
    )
  ) {
    throw new Error("Friend request already sent");
  }

  if (
    targetUser.friendRequestsReceived.some(
      (req: any) => req.from.toString() === this._id.toString()
    )
  ) {
    throw new Error("Friend request already exists");
  }

  // If target user has public profile, automatically become friends
  if (targetUser.profileVisibility === "public") {
    // Add each other as friends
    this.friends.push(targetUserId);
    targetUser.friends.push(this._id);

    await Promise.all([this.save(), targetUser.save()]);

    return { message: "Added as friend successfully (public profile)" };
  } else {
    // For private profiles, send friend request
    this.friendRequestsSent.push({ to: targetUserId, sentAt: new Date() });
    await this.save();

    targetUser.friendRequestsReceived.push({
      from: this._id,
      sentAt: new Date(),
    });
    await targetUser.save();

    return { message: "Friend request sent successfully" };
  }
};

userSchema.methods.acceptFriendRequest = async function (fromUserId: string) {
  const User = mongoose.model("User");
  const fromUser = await User.findById(fromUserId);

  if (!fromUser) {
    throw new Error("User not found");
  }

  const requestIndex = this.friendRequestsReceived.findIndex(
    (req: any) => req.from.toString() === fromUserId
  );

  if (requestIndex === -1) {
    throw new Error("Friend request not found");
  }

  this.friendRequestsReceived.splice(requestIndex, 1);
  const sentRequestIndex = fromUser.friendRequestsSent.findIndex(
    (req: any) => req.to.toString() === this._id.toString()
  );
  if (sentRequestIndex !== -1) {
    fromUser.friendRequestsSent.splice(sentRequestIndex, 1);
  }

  // Add each other as friends
  this.friends.push(fromUserId);
  fromUser.friends.push(this._id);

  await Promise.all([this.save(), fromUser.save()]);

  return { message: "Friend request accepted" };
};

userSchema.methods.rejectFriendRequest = async function (fromUserId: string) {
  const User = mongoose.model("User");
  const fromUser = await User.findById(fromUserId);

  if (!fromUser) {
    throw new Error("User not found");
  }

  // Remove the friend request from both users
  const requestIndex = this.friendRequestsReceived.findIndex(
    (req: any) => req.from.toString() === fromUserId
  );

  if (requestIndex === -1) {
    throw new Error("Friend request not found");
  }

  this.friendRequestsReceived.splice(requestIndex, 1);
  const sentRequestIndex = fromUser.friendRequestsSent.findIndex(
    (req: any) => req.to.toString() === this._id.toString()
  );
  if (sentRequestIndex !== -1) {
    fromUser.friendRequestsSent.splice(sentRequestIndex, 1);
  }

  await Promise.all([this.save(), fromUser.save()]);

  return { message: "Friend request rejected" };
};

userSchema.methods.removeFriend = async function (friendId: string) {
  const User = mongoose.model("User");
  const friend = await User.findById(friendId);

  if (!friend) {
    throw new Error("User not found");
  }

  // Remove from both friends lists
  this.friends = this.friends.filter((id: any) => id.toString() !== friendId);
  friend.friends = friend.friends.filter(
    (id: any) => id.toString() !== this._id.toString()
  );

  await Promise.all([this.save(), friend.save()]);

  return { message: "Friend removed successfully" };
};

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ isVerified: 1 });
userSchema.index({ friends: 1 });
userSchema.index({ "friendRequestsReceived.from": 1 });
userSchema.index({ "friendRequestsSent.to": 1 });
userSchema.index({ provider: 1 });

export default userSchema;

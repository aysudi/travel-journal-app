import mongoose from "mongoose";
import JournalEntryModel from "../models/JournalEntry.js";
import DestinationModel from "../models/Destination.js";
import UserModel from "../models/User.js";
import {
  JournalEntryData,
  JournalEntryQuery,
  JournalEntryUpdateData,
  PaginatedJournalEntries,
} from "../types/journalTypes.js";

// Create a new journal entry
export const createJournalEntry = async (
  entryData: JournalEntryData,
  authorId: string
): Promise<any> => {
  const destination = await DestinationModel.findById(
    entryData.destination
  ).populate({
    path: "list",
    select: "owner customPermissions visibility",
  });

  if (!destination) {
    throw new Error("Destination not found");
  }

  const journalEntry = new JournalEntryModel({
    ...entryData,
    author: authorId,
  });

  await journalEntry.save();

  return await getJournalEntryById(journalEntry._id.toString());
};

export const getJournalEntryById = async (entryId: string): Promise<any> => {
  const journalEntry = await JournalEntryModel.findById(entryId)
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title owner visibility customPermissions",
      },
    });

  if (!journalEntry) {
    throw new Error("Journal entry not found");
  }

  return journalEntry;
};

// Update journal entry
export const updateJournalEntry = async (
  entryId: string,
  updateData: JournalEntryUpdateData,
  userId: string
): Promise<any> => {
  const journalEntry = await JournalEntryModel.findById(entryId);

  if (!journalEntry) {
    throw new Error("Journal entry not found");
  }

  if (journalEntry.author.toString() !== userId) {
    throw new Error("You don't have permission to update this journal entry");
  }

  const updatedEntry = await JournalEntryModel.findByIdAndUpdate(
    entryId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title owner customPermissions visibility",
      },
    });

  return updatedEntry;
};

// Delete journal entry
export const deleteJournalEntry = async (
  entryId: string,
  userId: string
): Promise<void> => {
  const journalEntry = await JournalEntryModel.findById(entryId);

  if (!journalEntry) {
    throw new Error("Journal entry not found");
  }

  if (journalEntry.author.toString() !== userId) {
    throw new Error("You don't have permission to delete this journal entry");
  }

  await JournalEntryModel.findByIdAndDelete(entryId);
};

// Like journal entry
export const likeJournalEntry = async (
  entryId: string,
  userId: string
): Promise<any> => {
  const updatedEntry = await JournalEntryModel.findByIdAndUpdate(
    entryId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "likes",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title owner customPermissions visibility",
      },
    });

  return updatedEntry;
};

// Unlike journal entry
export const unlikeJournalEntry = async (
  entryId: string,
  userId: string
): Promise<any> => {
  const updatedEntry = await JournalEntryModel.findByIdAndUpdate(
    entryId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "likes",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title owner customPermissions visibility",
      },
    });

  return updatedEntry;
};

// Get journal entries with filtering, pagination, and search
export const getJournalEntries = async (
  query: JournalEntryQuery
): Promise<PaginatedJournalEntries> => {
  const {
    page = 1,
    limit = 10,
    destination,
    author,
    public: isPublic,
    search,
    sort = "createdAt",
    order = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const filter: any = {};

  if (destination) filter.destination = destination;
  if (author) filter.author = author;
  if (typeof isPublic === "boolean") filter.public = isPublic;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const sortObj: any = {};
  sortObj[sort] = order === "asc" ? 1 : -1;

  const [entries, total] = await Promise.all([
    JournalEntryModel.find(filter)
      .populate({
        path: "author",
        select: "fullName username profileImage",
      })
      .populate({
        path: "destination",
        select: "name location list",
        populate: {
          path: "list",
          select: "title owner customPermissions visibility",
        },
      })
      .populate({
        path: "comments",
        select: "author content likes",
      })
      .populate({ path: "likes", select: "fullName username profileImage" })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    JournalEntryModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: entries,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Get journal entries by destination ID
export const getJournalEntriesByDestination = async (
  destinationId: string,
  userId?: string
): Promise<any[]> => {
  const destination = await DestinationModel.findById(destinationId).populate({
    path: "list",
    select: "owner customPermissions visibility",
  });

  if (!destination) {
    throw new Error("Destination not found");
  }

  const filter: any = { destination: destinationId };

  if (userId) {
    const travelList = destination.list as any;
    const hasAccess =
      travelList.owner.toString() === userId ||
      travelList.collaborators.includes(userId);

    if (hasAccess) {
    } else {
      filter.public = true;
    }
  } else {
    filter.public = true;
  }

  const entries = await JournalEntryModel.find(filter)
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location",
    })
    .sort({ createdAt: -1 });

  return entries;
};

// Get journal entries by author ID
export const getJournalEntriesByAuthor = async (
  authorId: string,
  currentUserId?: string
): Promise<any[]> => {
  const author = await UserModel.findById(authorId);
  if (!author) {
    throw new Error("Author not found");
  }

  const filter: any = { author: authorId };

  if (!currentUserId || currentUserId !== authorId) {
    filter.public = true;
  }

  const entries = await JournalEntryModel.find(filter)
    .populate({
      path: "author",
      select: "fullName username profileImage",
    })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title visibility",
      },
    })
    .sort({ createdAt: -1 });

  return entries;
};

// Get public journal entries (for discovery/feed)
export const getPublicJournalEntries = async (
  query: JournalEntryQuery
): Promise<PaginatedJournalEntries> => {
  const {
    page = 1,
    limit = 10,
    search,
    sort = "createdAt",
    order = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const filter: any = { public: true };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === "asc" ? 1 : -1;

  const [entries, total] = await Promise.all([
    JournalEntryModel.find(filter)
      .populate({
        path: "author",
        select: "fullName username profileImage",
      })
      .populate({
        path: "destination",
        select: "name location list",
        populate: {
          path: "list",
          select: "title visibility",
        },
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    JournalEntryModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: entries,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Get journal entry statistics for a user
export const getJournalEntryStats = async (userId: string): Promise<any> => {
  const stats = await JournalEntryModel.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        publicEntries: {
          $sum: { $cond: [{ $eq: ["$public", true] }, 1, 0] },
        },
        privateEntries: {
          $sum: { $cond: [{ $eq: ["$public", false] }, 1, 0] },
        },
        totalPhotos: { $sum: { $size: { $ifNull: ["$photos", []] } } },
      },
    },
    {
      $project: {
        _id: 0,
        totalEntries: 1,
        publicEntries: 1,
        privateEntries: 1,
        totalPhotos: 1,
      },
    },
  ]);

  return (
    stats[0] || {
      totalEntries: 0,
      publicEntries: 0,
      privateEntries: 0,
      totalPhotos: 0,
    }
  );
};

// Bulk update journal entries (useful for changing privacy settings)
export const bulkUpdateJournalEntries = async (
  entryIds: string[],
  updateData: JournalEntryUpdateData,
  userId: string
): Promise<any> => {
  const entries = await JournalEntryModel.find({
    _id: { $in: entryIds },
    author: userId,
  });

  if (entries.length !== entryIds.length) {
    throw new Error(
      "Some journal entries not found or you don't have permission to update them"
    );
  }

  const result = await JournalEntryModel.updateMany(
    {
      _id: { $in: entryIds },
      author: userId,
    },
    { $set: updateData }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

// Get recent journal entries activity for dashboard
export const getRecentJournalEntries = async (
  userId: string,
  limit: number = 5
): Promise<any[]> => {
  const recentEntries = await JournalEntryModel.find({ author: userId })
    .populate({
      path: "destination",
      select: "name location list",
      populate: {
        path: "list",
        select: "title visibility",
      },
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title content photos createdAt public")
    .lean();

  return recentEntries;
};

// Get journal entries by travel list ID
export const getJournalEntriesByTravelList = async (
  travelListId: string,
  query: Omit<JournalEntryQuery, "destination"> & { userId?: string } = {}
): Promise<PaginatedJournalEntries> => {
  const {
    page = 1,
    limit = 10,
    author,
    public: isPublic,
    search,
    sort = "createdAt",
    order = "desc",
    userId,
  } = query;

  const skip = (page - 1) * limit;

  const destinations = await DestinationModel.find({
    list: travelListId,
  }).select("_id visibility");
  const destinationIds = destinations.map((dest) => dest._id);

  if (destinationIds.length === 0) {
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const filter: any = {
    destination: { $in: destinationIds },
    $or: [{ public: true }, userId ? { author: userId } : {}],
  };

  if (author) filter.author = author;
  if (typeof isPublic === "boolean") filter.public = isPublic;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const sortObj: any = {};
  sortObj[sort] = order === "asc" ? 1 : -1;

  const [entries, total] = await Promise.all([
    JournalEntryModel.find(filter)
      .populate({
        path: "author",
        select: "fullName username profileImage",
      })
      .populate({
        path: "destination",
        select: "name location list",
        populate: {
          path: "list",
          select: "title owner visibility customPermissions",
        },
      })
      .populate({
        path: "comments",
      })
      .populate({ path: "likes", select: "fullName username profileImage" })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    JournalEntryModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: entries,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

import DestinationModel from "../models/Destination.js";
import TravelListModel from "../models/TravelList.js";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export interface DestinationData {
  name: string;
  location: string;
  datePlanned?: Date;
  dateVisited?: Date;
  status?: "Wishlist" | "Planned" | "Visited";
  notes?: string;
  images?: string[];
  list: string;
}

export interface DestinationUpdateData {
  name?: string;
  location?: string;
  datePlanned?: Date;
  dateVisited?: Date;
  status?: "Wishlist" | "Planned" | "Visited";
  notes?: string;
  images?: string[];
}

export interface DestinationQuery extends PaginationParams {
  list?: string;
  status?: "Wishlist" | "Planned" | "Visited";
  userId?: string;
}

export interface PaginatedDestinations {
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const createDestination = async (
  destinationData: DestinationData,
  userId: string
): Promise<any> => {
  const travelList = await TravelListModel.findById(destinationData.list);

  if (!travelList) {
    throw new Error("Travel list not found");
  }

  const hasAccess =
    travelList.owner.toString() === userId ||
    travelList.customPermissions.some(
      (perm: any) =>
        perm.user.toString() === userId &&
        (perm.level === "contribute" || perm.level === "co-owner")
    );

  if (!hasAccess) {
    throw new Error(
      "You don't have permission to add destinations to this travel list"
    );
  }

  const destination = new DestinationModel(destinationData);
  await destination.save();

  return await getDestinationById(destination._id.toString());
};

export const getDestinationById = async (
  destinationId: string
): Promise<any> => {
  const destination = await DestinationModel.findById(destinationId)
    .populate({
      path: "list",
      select: "title owner customPermissions",
      populate: {
        path: "owner",
        select: "fullName username profileImage",
      },
    })
    .populate({
      path: "journalEntries",
      select: "title content photos createdAt public author",
      populate: {
        path: "author",
        select: "fullName username profileImage",
      },
    });

  if (!destination) {
    throw new Error("Destination not found");
  }

  return destination;
};

export const updateDestination = async (
  destinationId: string,
  updateData: DestinationUpdateData,
  userId: string
): Promise<any> => {
  const destination = await DestinationModel.findById(destinationId).populate(
    "list",
    "owner customPermissions"
  );

  if (!destination) {
    throw new Error("Destination not found");
  }

  const travelList = destination.list as any;
  const hasAccess =
    travelList.owner.toString() === userId ||
    travelList.customPermissions.some(
      (perm: any) =>
        perm.user.toString() === userId &&
        (perm.level === "contribute" || perm.level === "co-owner")
    );

  if (!hasAccess) {
    throw new Error("You don't have permission to update this destination");
  }

  const updatedDestination = await DestinationModel.findByIdAndUpdate(
    destinationId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate({
    path: "list",
    select: "title owner customPermissions",
    populate: {
      path: "owner",
      select: "fullName username profileImage",
    },
  });

  return updatedDestination;
};

export const deleteDestination = async (
  destinationId: string,
  userId: string
): Promise<void> => {
  const destination = await DestinationModel.findById(destinationId).populate(
    "list",
    "owner customPermissions"
  );

  if (!destination) {
    throw new Error("Destination not found");
  }

  const travelList = destination.list as any;
  const hasAccess =
    travelList.owner.toString() === userId ||
    travelList.customPermissions.some(
      (perm: any) =>
        perm.user.toString() === userId &&
        (perm.level === "contribute" || perm.level === "co-owner")
    );

  if (!hasAccess) {
    throw new Error("You don't have permission to delete this destination");
  }

  await DestinationModel.findByIdAndDelete(destinationId);
};

export const getDestinations = async (
  query: DestinationQuery
): Promise<PaginatedDestinations> => {
  const {
    page = 1,
    limit = 10,
    list,
    status,
    search,
    sort = "createdAt",
    userId,
  } = query;

  const skip = (page - 1) * limit;

  const filter: any = {};

  if (list) filter.list = list;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  if (userId && !list) {
    const accessibleLists = await TravelListModel.find({
      $or: [{ owner: userId }, { "customPermissions.user": userId }],
    }).select("_id");

    filter.list = { $in: accessibleLists.map((list) => list._id) };
  }

  const sortObj: any = {};
  sortObj[sort] = -1;

  const [destinations, total] = await Promise.all([
    DestinationModel.find(filter)
      .populate({
        path: "list",
        select: "title owner customPermissions",
        populate: {
          path: "owner",
          select: "fullName username profileImage",
        },
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    DestinationModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: destinations,
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

export const getDestinationsByTravelList = async (
  listId: string,
  userId?: string
): Promise<any[]> => {
  // Verify travel list exists
  const travelList = await TravelListModel.findById(listId);
  if (!travelList) {
    throw new Error("Travel list not found");
  }

  if (userId) {
    const hasAccess =
      travelList.owner.toString() === userId ||
      travelList.customPermissions.some(
        (perm: any) => perm.user.toString() === userId
      );

    if (!hasAccess) {
      throw new Error(
        "You don't have permission to view destinations in this travel list"
      );
    }
  }

  const destinations = await DestinationModel.find({ list: listId })
    .populate({
      path: "journalEntries",
      select: "title content photos createdAt public author",
      populate: {
        path: "author",
        select: "fullName username profileImage",
      },
    })
    .sort({ createdAt: -1 });

  return destinations;
};

export const getDestinationsByStatus = async (
  status: "Wishlist" | "Planned" | "Visited",
  userId: string
): Promise<any[]> => {
  const accessibleLists = await TravelListModel.find({
    $or: [{ owner: userId }, { "customPermissions.user": userId }],
  }).select("_id");

  const destinations = await DestinationModel.find({
    status,
    list: { $in: accessibleLists.map((list) => list._id) },
  })
    .populate({
      path: "list",
      select: "title owner customPermissions",
    })
    .sort({ createdAt: -1 });

  return destinations;
};

export const getDestinationStats = async (userId: string): Promise<any> => {
  const accessibleLists = await TravelListModel.find({
    $or: [{ owner: userId }, { "customPermissions.user": userId }],
  }).select("_id");

  const stats = await DestinationModel.aggregate([
    {
      $match: {
        list: { $in: accessibleLists.map((list) => list._id) },
      },
    },
    {
      $group: {
        _id: null,
        totalDestinations: { $sum: 1 },
        wishlistCount: {
          $sum: { $cond: [{ $eq: ["$status", "Wishlist"] }, 1, 0] },
        },
        plannedCount: {
          $sum: { $cond: [{ $eq: ["$status", "Planned"] }, 1, 0] },
        },
        visitedCount: {
          $sum: { $cond: [{ $eq: ["$status", "Visited"] }, 1, 0] },
        },
        totalImages: { $sum: { $size: { $ifNull: ["$images", []] } } },
        destinationsWithNotes: {
          $sum: { $cond: [{ $ne: ["$notes", null] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalDestinations: 1,
        wishlistCount: 1,
        plannedCount: 1,
        visitedCount: 1,
        totalImages: 1,
        destinationsWithNotes: 1,
      },
    },
  ]);

  return (
    stats[0] || {
      totalDestinations: 0,
      wishlistCount: 0,
      plannedCount: 0,
      visitedCount: 0,
      totalImages: 0,
      destinationsWithNotes: 0,
    }
  );
};

export const updateDestinationStatus = async (
  destinationId: string,
  status: "Wishlist" | "Planned" | "Visited",
  userId: string
): Promise<any> => {
  const updateData: any = { status };

  if (status === "Visited") {
    updateData.dateVisited = new Date();
  }

  return await updateDestination(destinationId, updateData, userId);
};

export const bulkUpdateDestinationStatus = async (
  destinationIds: string[],
  status: "Wishlist" | "Planned" | "Visited",
  userId: string
): Promise<any> => {
  const destinations = await DestinationModel.find({
    _id: { $in: destinationIds },
  }).populate("list", "owner customPermissions");

  if (destinations.length !== destinationIds.length) {
    throw new Error("Some destinations not found");
  }

  for (const destination of destinations) {
    const travelList = destination.list as any;
    const hasAccess =
      travelList.owner.toString() === userId ||
      travelList.customPermissions.some(
        (perm: any) =>
          perm.user.toString() === userId &&
          (perm.level === "contribute" || perm.level === "co-owner")
      );

    if (!hasAccess) {
      throw new Error("You don't have permission to update some destinations");
    }
  }
  const updateData: any = { status };
  if (status === "Visited") {
    updateData.dateVisited = new Date();
  }

  const result = await DestinationModel.updateMany(
    { _id: { $in: destinationIds } },
    { $set: updateData }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

export const getRecentDestinations = async (
  userId: string,
  limit: number = 5
): Promise<any[]> => {
  const accessibleLists = await TravelListModel.find({
    $or: [{ owner: userId }, { "customPermissions.user": userId }],
  }).select("_id");

  const recentDestinations = await DestinationModel.find({
    list: { $in: accessibleLists.map((list) => list._id) },
  })
    .populate({
      path: "list",
      select: "title",
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("name location status datePlanned dateVisited createdAt")
    .lean();

  return recentDestinations;
};

export const searchDestinations = async (
  searchQuery: string,
  userId: string,
  options?: {
    status?: "Wishlist" | "Planned" | "Visited";
    limit?: number;
  }
): Promise<any[]> => {
  const accessibleLists = await TravelListModel.find({
    $or: [{ owner: userId }, { "customPermissions.user": userId }],
  }).select("_id");

  const filter: any = {
    list: { $in: accessibleLists.map((list) => list._id) },
    $or: [
      { name: { $regex: searchQuery, $options: "i" } },
      { location: { $regex: searchQuery, $options: "i" } },
      { notes: { $regex: searchQuery, $options: "i" } },
    ],
  };

  if (options?.status) {
    filter.status = options.status;
  }

  const destinations = await DestinationModel.find(filter)
    .populate({
      path: "list",
      select: "title",
    })
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50);

  return destinations;
};

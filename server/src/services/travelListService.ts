import TravelList from "../models/TravelList";

export const getAll = async (params?: PaginationParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
  } = params || {};

  const query: any = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const total = await TravelList.countDocuments(query);
  const lists = await TravelList.find(query)
    .populate("owner", "fullName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage")
    .sort({ [sort]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: lists,
    total,
    page,
    limit,
  };
};

export const getOne = async (id: string) =>
  await TravelList.findById(id)
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");

export const getOwnedLists = async (userId: string) => {
  const userOwnedLists = await TravelList.find({ owner: userId })
    .populate("owner", "fullName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage")
    .sort({ createdAt: -1 });

  return userOwnedLists;
};

export const getCollaboratingLists = async (userId: string) => {
  const userCollaboratingLists = await TravelList.find({
    "customPermissions.user": userId,
  })
    .populate("owner", "fullName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage")
    .sort({ createdAt: -1 });

  return userCollaboratingLists;
};

export const getPublicLists = async (params: PaginationParams) => {
  const { page = 1, limit = 10, search = "", sort = "createdAt" } = params;

  const query: any = { visibility: "public" };
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const total = await TravelList.countDocuments(query);
  const lists = await TravelList.find(query)
    .populate("owner", "fullName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage")
    .sort({ [sort]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: lists,
    total,
    page,
    limit,
  };
};

export const update = async (id: string, payload: any) =>
  await TravelList.findByIdAndUpdate(id, payload, { new: true })
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");

export const post = async (payload: any) => {
  const newList = await TravelList.create(payload);
  return await TravelList.findById(newList._id)
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const deleteOne = async (id: string) =>
  await TravelList.findByIdAndDelete(id);

export const addCustomPermission = async (
  listId: string,
  userId: string,
  permissionLevel: string,
  grantedBy: string
) => {
  return await TravelList.findByIdAndUpdate(
    listId,
    {
      $addToSet: {
        customPermissions: {
          user: userId,
          level: permissionLevel,
          grantedBy: grantedBy,
          grantedAt: new Date(),
        },
      },
    },
    { new: true }
  )
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const removeCustomPermission = async (
  listId: string,
  userId: string
) => {
  return await TravelList.findByIdAndUpdate(
    listId,
    { $pull: { customPermissions: { user: userId } } },
    { new: true }
  )
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const updateCustomPermission = async (
  listId: string,
  userId: string,
  newPermissionLevel: string
) => {
  return await TravelList.findOneAndUpdate(
    { _id: listId, "customPermissions.user": userId },
    { $set: { "customPermissions.$.level": newPermissionLevel } },
    { new: true }
  )
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const updateCoverImage = async (
  listId: string,
  coverImageUrl: string
) => {
  return await TravelList.findByIdAndUpdate(
    listId,
    { coverImage: coverImageUrl },
    { new: true }
  )
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const duplicateList = async (listId: string, newOwnerId: string) => {
  const originalList = await TravelList.findById(listId).populate(
    "destinations"
  );

  if (!originalList) {
    throw new Error("Travel list not found");
  }

  const duplicatedData = {
    title: `${originalList.title} (Copy)`,
    description: originalList.description,
    tags: [...originalList.tags],
    visibility: "private",
    owner: newOwnerId,
    coverImage: originalList.coverImage,
    destinations: originalList.destinations,
  };

  const duplicatedList = await TravelList.create(duplicatedData);
  return await TravelList.findById(duplicatedList._id)
    .populate("owner", "firstName lastName email profileImage")
    .populate("destinations")
    .populate("customPermissions.user", "fullName email profileImage");
};

export const checkUserPermission = (list: any, userId: string) => {
  if (list.owner.toString() === userId) return true;

  const customPerm = list.customPermissions.find(
    (p: any) => p.user.toString() === userId
  );
  if (customPerm) return true;

  if (list.visibility === "public") return true;
  if (list.visibility === "private") return false;

  return false;
};

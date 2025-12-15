import { Request, Response } from "express";
import * as travelListService from "../services/travelListService.js";
import uploadMiddleware, {
  travelListUploadMiddleware,
} from "../middlewares/uploadMiddleware.js";
import formatMongoData from "../utils/formatMongoData.js";
import * as premiumLimitService from "../services/premiumLimitService.js";

export const getAllTravelLists = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, sort } = req.query;
    const params = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      sort: sort as string,
    };

    const result = await travelListService.getAll(params);
    res.status(200).json({
      success: true,
      message: "Travel lists retrieved successfully",
      data: formatMongoData(result.data),
    });
  } catch (error: any) {
    console.error("Get all travel lists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve travel lists",
      error: error.message,
    });
  }
};

export const getTravelListById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const travelList = await travelListService.getOne(id);

    if (!travelList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Travel list retrieved successfully",
      data: travelList,
    });
  } catch (error: any) {
    console.error("Get travel list by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve travel list",
      error: error.message,
    });
  }
};

export const getOwnedTravelLists = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const ownedLists = await travelListService.getOwnedLists(userId);
    res.status(200).json({
      success: true,
      message: "Owned travel lists retrieved successfully",
      data: ownedLists,
    });
  } catch (error: any) {
    console.error("Get owned travel lists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve owned travel lists",
      error: error.message,
    });
  }
};

export const getCollaboratingTravelLists = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const collaboratingLists = await travelListService.getCollaboratingLists(
      userId
    );
    res.status(200).json({
      success: true,
      message: "Collaborating travel lists retrieved successfully",
      data: collaboratingLists,
    });
  } catch (error: any) {
    console.error("Get collaborating travel lists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve collaborating travel lists",
      error: error.message,
    });
  }
};

export const getPublicTravelLists = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, sort } = req.query;
    const params = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      search: search as string,
      sort: sort as string,
    };

    const result = await travelListService.getPublicLists(params);
    res.status(200).json({
      success: true,
      message: "Public travel lists retrieved successfully",
      data: formatMongoData(result.data),
    });
  } catch (error: any) {
    console.error("Get public travel lists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve public travel lists",
      error: error.message,
    });
  }
};

export const createTravelList = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user can create more travel lists
    const limitCheck = await premiumLimitService.canCreateTravelList(userId);
    if (!limitCheck.canCreate) {
      return res.status(403).json({
        success: false,
        message: "Travel list limit reached",
        data: {
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
          needsPremium: true,
        },
      });
    }

    if (req.body.tags && typeof req.body.tags === "string") {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = [];
      }
    }

    if (req.body.isPublic && typeof req.body.isPublic === "string") {
      req.body.isPublic = req.body.isPublic === "true";
    }

    const hasFile = !!(req as any).cloudinaryResult;
    const hasCoverImageUrl = !!req.body.coverImage;

    if (!hasFile && !hasCoverImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    const travelListData = {
      ...req.body,
      owner: userId,
    };

    const cloudinaryResult = (req as any).cloudinaryResult;

    const newTravelList = await travelListService.post(
      travelListData,
      cloudinaryResult
    );

    res.status(201).json({
      success: true,
      message: "Travel list created successfully",
      data: formatMongoData(newTravelList),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create travel list",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getUserLimits = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const limits = await premiumLimitService.getUserLimits(userId);

    res.status(200).json({
      success: true,
      message: "User limits retrieved successfully",
      data: limits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user limits",
      error: error.message,
    });
  }
};

export const updateTravelList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    const isOwner = existingList.owner._id.toString() === userId;
    const hasCustomPermission = existingList.customPermissions.some(
      (perm: any) =>
        perm.user._id.toString() === userId &&
        (perm.level === "contribute" || perm.level === "co-owner")
    );

    if (!isOwner && !hasCustomPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this travel list",
      });
    }

    const cloudinaryResult = (req as any).cloudinaryResult;
    const updatedTravelList = await travelListService.update(
      id,
      req.body,
      cloudinaryResult
    );

    res.status(200).json({
      success: true,
      message: "Travel list updated successfully",
      data: updatedTravelList,
    });
  } catch (error: any) {
    console.error("Update travel list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update travel list",
      error: error.message,
    });
  }
};

export const deleteTravelList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete this travel list",
      });
    }

    await travelListService.deleteOne(id);
    res.status(200).json({
      success: true,
      message: "Travel list deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete travel list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete travel list",
      error: error.message,
    });
  }
};

export const addCustomPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId, permissionLevel = "contribute" } = req.body;
    const userId = (req.user as any)?.id;

    if (!collaboratorId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can add permissions",
      });
    }

    const hasExistingPermission = existingList.customPermissions.some(
      (perm: any) => perm.user._id.toString() === collaboratorId
    );

    if (hasExistingPermission) {
      return res.status(400).json({
        success: false,
        message: "User already has custom permission",
      });
    }

    const updatedList = await travelListService.addCustomPermission(
      id,
      collaboratorId,
      permissionLevel,
      userId
    );
    res.status(200).json({
      success: true,
      message: "Permission added successfully",
      data: updatedList,
    });
  } catch (error: any) {
    console.error("Add custom permission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add permission",
      error: error.message,
    });
  }
};

export const removeCustomPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId } = req.body;
    const userId = (req.user as any)?.id;

    if (!collaboratorId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can remove permissions",
      });
    }

    const updatedList = await travelListService.removeCustomPermission(
      id,
      collaboratorId
    );
    res.status(200).json({
      success: true,
      message: "Permission removed successfully",
      data: updatedList,
    });
  } catch (error: any) {
    console.error("Remove custom permission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove permission",
      error: error.message,
    });
  }
};

export const updateCustomPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId, permissionLevel } = req.body;
    const userId = (req.user as any)?.id;

    if (!collaboratorId || !permissionLevel) {
      return res.status(400).json({
        success: false,
        message: "User ID and permission level are required",
      });
    }

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update permissions",
      });
    }

    const updatedList = await travelListService.updateCustomPermission(
      id,
      collaboratorId,
      permissionLevel
    );
    res.status(200).json({
      success: true,
      message: "Permission updated successfully",
      data: updatedList,
    });
  } catch (error: any) {
    console.error("Update custom permission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update permission",
      error: error.message,
    });
  }
};

export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    const isOwner = existingList.owner._id.toString() === userId;
    const hasCustomPermission = existingList.customPermissions.some(
      (perm: any) =>
        perm.user._id.toString() === userId &&
        (perm.level === "contribute" || perm.level === "co-owner")
    );

    if (!isOwner && !hasCustomPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to upload cover image",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const cloudinaryResult = (req as any).cloudinaryResult;
    if (!cloudinaryResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }
    const updatedList = await travelListService.updateCoverImage(
      id,
      cloudinaryResult.secure_url
    );

    res.status(200).json({
      success: true,
      message: "Cover image uploaded successfully",
      data: {
        coverImage: updatedList?.coverImage,
        travelList: updatedList,
      },
    });
  } catch (error: any) {
    console.error("Upload cover image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload cover image",
      error: error.message,
    });
  }
};

export const duplicateTravelList = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const duplicatedList = await travelListService.duplicateList(id, userId);

    res.status(201).json({
      success: true,
      message: "Travel list duplicated successfully",
      data: duplicatedList,
    });
  } catch (error: any) {
    console.error("Duplicate travel list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to duplicate travel list",
      error: error.message,
    });
  }
};

export const getFriendsLists = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;

    const friendsLists = await travelListService.getFriendsLists(
      userId,
      limit ? Number(limit) : 10
    );

    res.status(200).json({
      success: true,
      message: "Friends' travel lists retrieved successfully",
      data: formatMongoData(friendsLists),
    });
  } catch (error: any) {
    console.error("Get friends' lists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve friends' travel lists",
      error: error.message,
    });
  }
};

export { travelListUploadMiddleware };

import { Request, Response } from "express";
import * as travelListService from "../services/travelListService";
import uploadMiddleware from "../middlewares/uploadMiddleware";
import formatMongoData from "../utils/formatMongoData";

// Get all travel lists (with pagination and search)
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

// Get single travel list by ID
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

// Get user's owned travel lists
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

// Get user's collaborating travel lists
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

// Get public travel lists
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

// Create new travel list
export const createTravelList = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const travelListData = {
      ...req.body,
      owner: userId,
    };

    const newTravelList = await travelListService.post(travelListData);
    res.status(201).json({
      success: true,
      message: "Travel list created successfully",
      data: newTravelList,
    });
  } catch (error: any) {
    console.error("Create travel list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create travel list",
      error: error.message,
    });
  }
};

// Update travel list
export const updateTravelList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    // Check if travel list exists
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Check if user is owner or collaborator
    const isOwner = existingList.owner._id.toString() === userId;
    const isCollaborator = existingList.collaborators.some(
      (collaborator: any) => collaborator._id.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this travel list",
      });
    }

    const updatedTravelList = await travelListService.update(id, req.body);
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

// Delete travel list
export const deleteTravelList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    // Check if travel list exists and user is owner
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Only owner can delete
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

// Add collaborator to travel list
export const addCollaborator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId } = req.body;
    const userId = (req.user as any)?.id;

    if (!collaboratorId) {
      return res.status(400).json({
        success: false,
        message: "Collaborator user ID is required",
      });
    }

    // Check if travel list exists and user is owner
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Only owner can add collaborators
    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can add collaborators",
      });
    }

    // Check if user is already a collaborator
    const isAlreadyCollaborator = existingList.collaborators.some(
      (collaborator: any) => collaborator._id.toString() === collaboratorId
    );

    if (isAlreadyCollaborator) {
      return res.status(400).json({
        success: false,
        message: "User is already a collaborator",
      });
    }

    const updatedList = await travelListService.addCollaborator(
      id,
      collaboratorId
    );
    res.status(200).json({
      success: true,
      message: "Collaborator added successfully",
      data: updatedList,
    });
  } catch (error: any) {
    console.error("Add collaborator error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add collaborator",
      error: error.message,
    });
  }
};

// Remove collaborator from travel list
export const removeCollaborator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId } = req.body;
    const userId = (req.user as any)?.id;

    if (!collaboratorId) {
      return res.status(400).json({
        success: false,
        message: "Collaborator user ID is required",
      });
    }

    // Check if travel list exists and user is owner
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Only owner can remove collaborators
    if (existingList.owner._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can remove collaborators",
      });
    }

    const updatedList = await travelListService.removeCollaborator(
      id,
      collaboratorId
    );
    res.status(200).json({
      success: true,
      message: "Collaborator removed successfully",
      data: updatedList,
    });
  } catch (error: any) {
    console.error("Remove collaborator error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove collaborator",
      error: error.message,
    });
  }
};

// Upload cover image for travel list
export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    // Check if travel list exists and user has permission
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Check if user is owner or collaborator
    const isOwner = existingList.owner._id.toString() === userId;
    const isCollaborator = existingList.collaborators.some(
      (collaborator: any) => collaborator._id.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
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

    // Update travel list with new cover image
    const updatedList = await travelListService.updateCoverImage(
      id,
      (req.file as any).path
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

// Duplicate travel list
export const duplicateTravelList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if travel list exists
    const existingList = await travelListService.getOne(id);
    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: "Travel list not found",
      });
    }

    // Check if list is public or user has access
    const isPublic = existingList.isPublic;
    const isOwner = existingList.owner._id.toString() === userId;
    const isCollaborator = existingList.collaborators.some(
      (collaborator: any) => collaborator._id.toString() === userId
    );

    if (!isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to duplicate this travel list",
      });
    }

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

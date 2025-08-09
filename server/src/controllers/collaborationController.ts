import { Request, Response } from "express";
import CollaborationService from "../services/collaborationService.js";
import mongoose from "mongoose";
import Joi from "joi";
import formatMongoData from "../utils/formatMongoData.js";

// Validation schemas
const joinRequestSchema = Joi.object({
  message: Joi.string().max(200).optional(),
});

class CollaborationController {
  static async joinOrRequestToJoin(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = joinRequestSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          details: error.details[0].message,
        });
      }

      const travelListId = new mongoose.Types.ObjectId(req.params.travelListId);
      const userId = new mongoose.Types.ObjectId((req as any).user.id);
      const { message } = value;

      const result = await CollaborationService.joinOrRequestToJoin(
        travelListId,
        userId,
        message
      );

      res.status(200).json({
        success: true,
        message: result.message,
        action: result.action,
      });
    } catch (error: any) {
      console.error("Error in join/request collaboration:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to process collaboration request",
      });
    }
  }

  // Approve collaboration request (Owner only)
  static async approveRequest(req: Request, res: Response) {
    try {
      const travelListId = new mongoose.Types.ObjectId(req.params.travelListId);
      const requesterId = new mongoose.Types.ObjectId(req.params.requesterId);
      const ownerId = new mongoose.Types.ObjectId((req as any).user.id);

      const result = await CollaborationService.approveRequest(
        travelListId,
        requesterId,
        ownerId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Error approving collaboration request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to approve collaboration request",
      });
    }
  }

  // Reject collaboration request (Owner only)
  static async rejectRequest(req: Request, res: Response) {
    try {
      const travelListId = new mongoose.Types.ObjectId(req.params.travelListId);
      const requesterId = new mongoose.Types.ObjectId(req.params.requesterId);
      const ownerId = new mongoose.Types.ObjectId((req as any).user.id);

      const result = await CollaborationService.rejectRequest(
        travelListId,
        requesterId,
        ownerId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Error rejecting collaboration request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to reject collaboration request",
      });
    }
  }

  // Remove collaborator (Owner only)
  static async removeCollaborator(req: Request, res: Response) {
    try {
      const travelListId = new mongoose.Types.ObjectId(req.params.travelListId);
      const collaboratorId = new mongoose.Types.ObjectId(
        req.params.collaboratorId
      );
      const ownerId = new mongoose.Types.ObjectId((req as any).user.id);

      const result = await CollaborationService.removeCollaborator(
        travelListId,
        collaboratorId,
        ownerId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Error removing collaborator:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove collaborator",
      });
    }
  }

  // Get pending requests for a travel list (Owner only)
  static async getPendingRequests(req: Request, res: Response) {
    try {
      const travelListId = new mongoose.Types.ObjectId(req.params.travelListId);
      const ownerId = new mongoose.Types.ObjectId((req as any).user.id);

      const pendingRequests = await CollaborationService.getPendingRequests(
        travelListId,
        ownerId
      );

      res.status(200).json({
        success: true,
        message: "Pending requests retrieved successfully",
        data: formatMongoData(pendingRequests),
      });
    } catch (error: any) {
      console.error("Error getting pending requests:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get pending requests",
      });
    }
  }
}

export default CollaborationController;

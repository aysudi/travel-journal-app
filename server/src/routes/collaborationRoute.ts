import express from "express";
import CollaborationController from "../controllers/collaborationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Collaboration routes
router.post("/:travelListId/join", CollaborationController.joinOrRequestToJoin);
router.get(
  "/:travelListId/requests",
  CollaborationController.getPendingRequests
);
router.post(
  "/:travelListId/requests/:requesterId/approve",
  CollaborationController.approveRequest
);
router.post(
  "/:travelListId/requests/:requesterId/reject",
  CollaborationController.rejectRequest
);
router.delete(
  "/:travelListId/collaborators/:collaboratorId",
  CollaborationController.removeCollaborator
);

export default router;

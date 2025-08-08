import express from "express";
import { createDestination, getDestinationById, updateDestination, deleteDestination, getDestinations, getDestinationsByTravelList, getDestinationsByStatus, getDestinationStats, updateDestinationStatus, bulkUpdateDestinationStatus, getRecentDestinations, searchDestinations, } from "../controllers/destinationController";
import { authenticateToken } from "../middlewares/authMiddleware";
const destinationRouter = express.Router();
// Public routes (limited access - some may require optional auth)
destinationRouter.get("/travel-list/:listId", getDestinationsByTravelList);
destinationRouter.get("/:id", getDestinationById);
// Protected routes (authentication required)
destinationRouter.use(authenticateToken);
// Main destination operations
destinationRouter.get("/", getDestinations);
destinationRouter.post("/", createDestination);
destinationRouter.put("/:id", updateDestination);
destinationRouter.delete("/:id", deleteDestination);
// Status-related operations
destinationRouter.get("/status/:status", getDestinationsByStatus);
destinationRouter.patch("/:id/status", updateDestinationStatus);
destinationRouter.patch("/bulk/status", bulkUpdateDestinationStatus);
// User-specific operations
destinationRouter.get("/my/stats", getDestinationStats);
destinationRouter.get("/my/recent", getRecentDestinations);
destinationRouter.get("/my/search", searchDestinations);
export default destinationRouter;

import express from "express";
import {
  getAllTravelLists,
  getTravelListById,
  getOwnedTravelLists,
  getCollaboratingTravelLists,
  getPublicTravelLists,
  createTravelList,
  updateTravelList,
  deleteTravelList,
  addCollaborator,
  removeCollaborator,
  uploadCoverImage,
  duplicateTravelList,
} from "../controllers/travelListController";
import { authenticateToken } from "../middlewares/authMiddleware";
import uploadMiddleware from "../middlewares/uploadMiddleware";

const travelListRouter = express.Router();

travelListRouter.get("/public", getPublicTravelLists);

travelListRouter.use(authenticateToken);

travelListRouter.get("/", getAllTravelLists);
travelListRouter.get("/owned", getOwnedTravelLists);
travelListRouter.get("/collaborating", getCollaboratingTravelLists);
travelListRouter.get("/:id", getTravelListById);

travelListRouter.post("/", createTravelList);
travelListRouter.put("/:id", updateTravelList);
travelListRouter.delete("/:id", deleteTravelList);

travelListRouter.post("/:id/collaborators", addCollaborator);
travelListRouter.delete("/:id/collaborators", removeCollaborator);

travelListRouter.post(
  "/:id/cover-image",
  ...uploadMiddleware("travel-lists"),
  uploadCoverImage
);

travelListRouter.post("/:id/duplicate", duplicateTravelList);

export default travelListRouter;

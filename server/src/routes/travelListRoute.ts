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
  addCustomPermission,
  removeCustomPermission,
  updateCustomPermission,
  uploadCoverImage,
  duplicateTravelList,
  getFriendsLists,
  travelListUploadMiddleware,
  getUserLimits,
} from "../controllers/travelListController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const travelListRouter = express.Router();

travelListRouter.get("/public", getPublicTravelLists);

travelListRouter.use(authenticateToken);

travelListRouter.get("/", getAllTravelLists);
travelListRouter.get("/owned", getOwnedTravelLists);
travelListRouter.get("/collaborating", getCollaboratingTravelLists);
travelListRouter.get("/friends", getFriendsLists);
travelListRouter.get("/limits", getUserLimits);
travelListRouter.get("/:id", getTravelListById);

travelListRouter.post(
  "/",
  ...travelListUploadMiddleware("travel-lists"),
  createTravelList
);
travelListRouter.put(
  "/:id",
  ...travelListUploadMiddleware("travel-lists"),
  updateTravelList
);
travelListRouter.delete("/:id", deleteTravelList);

travelListRouter.post("/:id/permissions", addCustomPermission);
travelListRouter.put("/:id/permissions", updateCustomPermission);
travelListRouter.delete("/:id/permissions", removeCustomPermission);

travelListRouter.post(
  "/:id/cover-image",
  ...travelListUploadMiddleware("travel-lists"),
  uploadCoverImage
);

travelListRouter.post("/:id/duplicate", duplicateTravelList);

export default travelListRouter;

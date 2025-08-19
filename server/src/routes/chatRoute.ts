import express from "express";
import {
  createNewChat,
  deleteChatById,
  getAllChatsController,
  getCurrentUserChats,
  updateChatDetails,
  getOrCreateChatByListIdController,
} from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.get("/all", getAllChatsController);
chatRouter.get("/", getCurrentUserChats);
chatRouter.post("/", createNewChat);
chatRouter.patch("/:chatId", updateChatDetails);
chatRouter.delete("/:chatId", deleteChatById);
chatRouter.get("/by-list", getOrCreateChatByListIdController);

export default chatRouter;

import express from "express";
import {
  editMessage,
  getAllMessagesController,
  getMessages,
  markAsRead,
  removeMessage,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/all", getAllMessagesController);
messageRouter.post("/", sendMessage);
messageRouter.get("/chat/:chatId", getMessages);
messageRouter.patch("/:id", editMessage);
messageRouter.delete("/:id", removeMessage);
messageRouter.patch("/:messageId/read", markAsRead);

export default messageRouter;

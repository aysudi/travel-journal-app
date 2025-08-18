import express from "express";
import {
  editMessage,
  getAllMessagesController,
  getMessages,
  removeMessage,
  sendMessage,
} from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/all", getAllMessagesController);
messageRouter.post("/", sendMessage);
messageRouter.patch("/:id", editMessage);
messageRouter.delete("/:id", removeMessage);
messageRouter.get("/chat/:chatId", getMessages);

export default messageRouter;

import mongoose from "mongoose";
import chatSchema from "../schemas/chatSchema.js";

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;

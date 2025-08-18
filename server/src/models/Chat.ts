import mongoose from "mongoose";
import chatSchema from "../schemas/chatSchema";

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;

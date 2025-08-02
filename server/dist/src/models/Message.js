import mongoose from "mongoose";
import messageSchema from "../schemas/messageSchema.js";
// Add indexes for frequently queried fields
messageSchema.index({ list: 1, timestamp: -1 }); // Compound index for chat messages
messageSchema.index({ sender: 1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;

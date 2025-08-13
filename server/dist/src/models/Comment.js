import mongoose from "mongoose";
import commentSchema from "../schemas/commentsSchema";
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

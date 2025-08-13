import express from "express";
import { getAllComments, postComment, getCommentsByJournalEntry, removeComment, toggleCommentLike, } from "../controllers/commentController";
const commentRouter = express.Router();
commentRouter.get("/journal/:journalEntryId", getCommentsByJournalEntry);
commentRouter.get("/", getAllComments);
commentRouter.post("/", postComment);
commentRouter.delete("/:commentId", removeComment);
commentRouter.patch("/:commentId/like", toggleCommentLike);
export default commentRouter;

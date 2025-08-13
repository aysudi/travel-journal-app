import express from "express";
import { getAllComments, postComment, getCommentsByJournalEntry, removeComment, toggleCommentLike } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";
const commentRouter = express.Router();
// Public routes
commentRouter.get("/journal/:journalEntryId", getCommentsByJournalEntry);
// Protected routes
commentRouter.get("/", authenticateToken, getAllComments);
commentRouter.post("/", authenticateToken, postComment);
commentRouter.delete("/:commentId", authenticateToken, removeComment);
commentRouter.patch("/:commentId/like", authenticateToken, toggleCommentLike);
export default commentRouter;

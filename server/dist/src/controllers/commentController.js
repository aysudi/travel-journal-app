import { getAll, post, getByJournalEntry, deleteComment, likeComment, unlikeComment, } from "../services/commentService";
import Comment from "../models/Comment";
import formatMongoData from "../utils/formatMongoData";
export const getAllComments = async (req, res, next) => {
    try {
        const comments = await getAll();
        res.status(200).json({
            message: "Comments fetched successfully",
            data: formatMongoData(comments),
        });
    }
    catch (error) {
        next(error);
    }
};
export const postComment = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const commentData = {
            ...req.body,
            author: userId,
        };
        const newComment = await post(commentData);
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: formatMongoData(newComment),
        });
    }
    catch (error) {
        next(error);
    }
};
// Get comments by journal entry
export const getCommentsByJournalEntry = async (req, res, next) => {
    try {
        const { journalEntryId } = req.params;
        if (!journalEntryId) {
            res.status(400).json({
                success: false,
                message: "Journal entry ID is required",
            });
            return;
        }
        const comments = await getByJournalEntry(journalEntryId);
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: formatMongoData(comments),
        });
    }
    catch (error) {
        next(error);
    }
};
// Delete comment
export const removeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: "Comment not found",
            });
            return;
        }
        if (comment.author.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You can only delete your own comments",
            });
            return;
        }
        await deleteComment(commentId);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
// Toggle like/unlike comment
export const toggleCommentLike = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        if (!commentId || commentId === "undefined") {
            res.status(400).json({
                success: false,
                message: "Comment ID is required",
            });
            return;
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: "Comment not found",
            });
            return;
        }
        const isLiked = comment.likes.includes(userId);
        let updatedComment;
        if (isLiked) {
            updatedComment = await unlikeComment(commentId, userId);
        }
        else {
            updatedComment = await likeComment(commentId, userId);
        }
        res.status(200).json({
            success: true,
            message: isLiked
                ? "Comment unliked successfully"
                : "Comment liked successfully",
            data: formatMongoData(updatedComment),
        });
    }
    catch (error) {
        next(error);
    }
};

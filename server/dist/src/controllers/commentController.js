import { getAll, post, getByJournalEntry, deleteComment, likeComment, unlikeComment, } from "../services/commentService.js";
import Comment from "../models/Comment.js";
import formatMongoData from "../utils/formatMongoData.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
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
export const postComment = [
    upload.array("photos", 3),
    async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
                return;
            }
            // Handle image uploads to Cloudinary
            let photoUrls = [];
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    try {
                        await new Promise((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream({ folder: "comments" }, (error, result) => {
                                if (error)
                                    reject(error);
                                else {
                                    if (result?.secure_url)
                                        photoUrls.push(result.secure_url);
                                    resolve(result);
                                }
                            });
                            stream.end(file.buffer);
                        });
                    }
                    catch (uploadError) {
                        console.error("Image upload failed:", uploadError);
                    }
                }
            }
            const commentData = {
                ...req.body,
                author: userId,
                photos: photoUrls,
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
    },
];
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
        // Delete images from Cloudinary if any
        if (comment.photos && comment.photos.length > 0) {
            for (const photoUrl of comment.photos) {
                try {
                    const parts = photoUrl.split("/");
                    const folder = parts[parts.length - 2];
                    const filename = parts[parts.length - 1].split(".")[0];
                    const publicId = `${folder}/${filename}`;
                    await cloudinary.uploader.destroy(publicId);
                }
                catch (deleteError) {
                    console.error("Failed to delete comment image from Cloudinary:", deleteError);
                }
            }
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

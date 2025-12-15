import Comment from "../models/Comment.js";
export const getAll = async () => {
    return await Comment.find()
        .populate("author", "-password")
        .populate("likes", "-password")
        .populate("journalEntry");
};
export const getByJournalEntry = async (journalEntryId) => {
    return await Comment.find({ journalEntry: journalEntryId })
        .populate("author", "fullName username profileImage")
        .sort({ createdAt: -1 });
};
export const post = async (payload) => {
    const newComment = await Comment.create(payload);
    return await Comment.findById(newComment._id).populate("author", "fullName username profileImage");
};
export const deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId);
};
export const likeComment = async (commentId, userId) => {
    return await Comment.findByIdAndUpdate(commentId, { $addToSet: { likes: userId } }, { new: true }).populate("author", "fullName username profileImage");
};
export const unlikeComment = async (commentId, userId) => {
    return await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true }).populate("author", "fullName username profileImage");
};

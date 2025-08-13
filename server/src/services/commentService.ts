import Comment from "../models/Comment";

export const getAll = async () => {
  return await Comment.find()
    .populate("author", "-password")
    .populate("likes", "-password")
    .populate("journalEntry");
};

export const getByJournalEntry = async (journalEntryId: string) => {
  return await Comment.find({ journalEntry: journalEntryId })
    .populate("author", "fullName username profileImage")
    .sort({ createdAt: -1 });
};

export const post = async (payload: any) => await Comment.create(payload);

export const deleteComment = async (commentId: string) => {
  return await Comment.findByIdAndDelete(commentId);
};

export const likeComment = async (commentId: string, userId: string) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { $addToSet: { likes: userId } },
    { new: true }
  ).populate("author", "fullName username profileImage");
};

export const unlikeComment = async (commentId: string, userId: string) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { $pull: { likes: userId } },
    { new: true }
  ).populate("author", "fullName username profileImage");
};

import Comment from "../models/Comment";

export const getAll = async () => {
  return await Comment.find()
    .populate("author", "-password")
    .populate("likes", "-password")
    .populate("journalEntry");
};

export const post = async (payload: any) => await Comment.create(payload);

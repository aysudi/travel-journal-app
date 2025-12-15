import { createChat, getUserChats, getAllChats, updateChat, deleteChat, getOrCreateChatByListId, } from "../services/chatService.js";
import ChatModel from "../models/Chat.js";
import { v2 as cloudinary } from "cloudinary";
export const getAllChatsController = async (req, res, next) => {
    try {
        const response = await getAllChats();
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const createNewChat = async (req, res, next) => {
    try {
        const { members, list, description, createdBy, name } = req.body;
        if (!members || !Array.isArray(members)) {
            return res.status(400).json({
                success: false,
                message: "Members array is required",
            });
        }
        const allMembers = [...new Set(members)];
        const response = await createChat({
            members: allMembers,
            list,
            description,
            createdBy,
            name,
        });
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getCurrentUserChats = async (req, res, next) => {
    try {
        const listId = req.query.listId;
        if (!listId) {
            return res.status(400).json({
                success: false,
                message: "listId query parameter is required",
            });
        }
        const response = await getUserChats(listId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const updateChatDetails = async (req, res, next) => {
    try {
        const userId = req.body.id;
        const { chatId } = req.params;
        const updateData = { ...req.body };
        const chat = await ChatModel.findById(chatId);
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        if (req.cloudinaryResult) {
            if (chat?.public_id && chat?.public_id !== "") {
                try {
                    await cloudinary.uploader.destroy(chat?.public_id);
                }
                catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error);
                }
            }
            updateData.avatar = req.cloudinaryResult.secure_url;
            updateData.public_id = req.cloudinaryResult.public_id;
        }
        const response = await updateChat(chatId, updateData, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const deleteChatById = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        const response = await deleteChat(chatId, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getOrCreateChatByListIdController = async (req, res, next) => {
    try {
        const listId = req.query.listId || req.body.listId;
        const userId = req.query.userId || req.body.userId;
        if (!listId || !userId) {
            return res.status(400).json({
                success: false,
                message: "listId and userId are required",
            });
        }
        const response = await getOrCreateChatByListId(listId, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};

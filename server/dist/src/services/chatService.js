import { Types } from "mongoose";
import ChatModel from "../models/Chat";
import formatMongoData from "../utils/formatMongoData";
import MessageModel from "../models/Message";
import TravelList from "../models/TravelList";
import UserModel from "../models/User";
import "../config/cloudConfig";
export const getAllChats = async () => {
    try {
        const chats = await ChatModel.find({})
            .populate("members.user", "username email fullName profileImage isOnline lastSeen")
            .populate("lastMessage.sender", "username email fullName profileImage isOnline")
            .populate("lastMessage.message")
            .sort({ "lastMessage.timestamp": -1, updatedAt: -1 });
        return {
            success: true,
            data: formatMongoData(chats),
            message: "All chats retrieved successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to retrieve all chats",
        };
    }
};
export const createChat = async (data) => {
    try {
        const membersWithMetadata = data.members.map((memberId) => ({
            user: new Types.ObjectId(memberId),
            joinedAt: new Date(),
            isActive: true,
        }));
        const chat = new ChatModel({
            members: membersWithMetadata,
            list: data.list,
            description: data?.description,
            createdBy: new Types.ObjectId(data.createdBy),
            messageCount: 0,
            name: data.name,
        });
        await chat.save();
        const populatedChat = await ChatModel.findById(chat._id)
            .populate("members.user")
            .populate("createdBy", "username email profileImage username");
        return {
            success: true,
            data: formatMongoData(populatedChat),
            message: "Chat created successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to create chat",
        };
    }
};
export const getUserChats = async (listId) => {
    try {
        const chats = await ChatModel.find({
            list: new Types.ObjectId(listId),
        })
            .populate("members.user", "username email profile isOnline lastSeen")
            .populate("lastMessage.sender", "username profile")
            .populate("lastMessage.message")
            .sort({ "lastMessage.timestamp": -1, updatedAt: -1 });
        return {
            success: true,
            data: formatMongoData(chats),
            message: "Chats retrieved successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to retrieve chats",
        };
    }
};
export const updateChat = async (chatId, updateData, userId) => {
    try {
        const chat = await ChatModel.findOne({
            _id: new Types.ObjectId(chatId),
        });
        if (!chat) {
            return {
                success: false,
                message: "Chat not found or insufficient permissions",
            };
        }
        const updatedChat = await ChatModel.findByIdAndUpdate(chatId, { $set: updateData }, { new: true })
            .populate("members.user", "username email fullName profileImage")
            .populate("createdBy", "username profileImage fullName email");
        return {
            success: true,
            data: updatedChat,
            message: "Chat updated successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to update chat",
        };
    }
};
export const deleteChat = async (chatId, userId) => {
    try {
        const chat = await ChatModel.findOne({
            _id: new Types.ObjectId(chatId),
            "members.user": new Types.ObjectId(userId),
        });
        if (!chat) {
            return {
                success: false,
                message: "Chat not found or insufficient permissions",
            };
        }
        await MessageModel.deleteMany({ chat: new Types.ObjectId(chatId) });
        await ChatModel.findByIdAndDelete(chatId);
        return {
            success: true,
            message: "Chat deleted successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to delete chat",
        };
    }
};
// Get or create chat by list id
export const getOrCreateChatByListId = async (listId, userId) => {
    try {
        let chat = await ChatModel.findOne({ list: listId });
        if (!chat) {
            const list = await TravelList.findById(listId).populate("owner customPermissions.user");
            if (!list)
                throw new Error("List not found");
            let memberIds = [];
            if (list.visibility === "friends") {
                const owner = list.owner;
                const ownerDoc = await UserModel.findById(owner);
                const friends = ownerDoc?.friends || [];
                memberIds = [
                    owner.toString(),
                    ...friends.map((f) => f.toString()),
                ];
            }
            else if (list.visibility === "private") {
                memberIds = [
                    list.owner.toString(),
                    ...list.customPermissions.map((perm) => perm.user.toString()),
                ];
            }
            else if (list.visibility === "public") {
                memberIds = [userId];
            }
            memberIds = Array.from(new Set(memberIds));
            const membersWithMetadata = memberIds.map((id) => ({
                user: new Types.ObjectId(id),
                joinedAt: new Date(),
                isActive: true,
            }));
            chat = new ChatModel({
                list: [listId],
                members: membersWithMetadata,
                createdBy: new Types.ObjectId(list.owner),
                messageCount: 0,
            });
            await chat.save();
        }
        const populatedChat = await ChatModel.findById(chat._id)
            .populate("members.user")
            .populate("createdBy", "username email profileImage username");
        return {
            success: true,
            data: formatMongoData(populatedChat),
            message: "Chat found or created by list id",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to get or create chat by list id",
        };
    }
};

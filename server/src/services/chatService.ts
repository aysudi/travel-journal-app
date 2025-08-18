import { Types } from "mongoose";
import ChatModel from "../models/Chat";
import formatMongoData from "../utils/formatMongoData";
import MessageModel from "../models/Message";

export const getAllChats = async () => {
  try {
    const chats = await ChatModel.find({})
      .populate(
        "members.user",
        "username email fullName profileImage isOnline lastSeen"
      )
      .populate(
        "lastMessage.sender",
        "username email fullName profileImage isOnline"
      )
      .populate("lastMessage.message")
      .sort({ "lastMessage.timestamp": -1, updatedAt: -1 });

    return {
      success: true,
      data: formatMongoData(chats),
      message: "All chats retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve all chats",
    };
  }
};

export const createChat = async (data: any) => {
  try {
    const membersWithMetadata = data.members.map((memberId: string) => ({
      user: new Types.ObjectId(memberId),
      joinedAt: new Date(),
      isActive: true,
    }));

    const chat = new ChatModel({
      type: data.type,
      members: membersWithMetadata,
      name: data.name,
      description: data.description,
      createdBy: new Types.ObjectId(data.createdBy),
      messageCount: 0,
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create chat",
    };
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const chats = await ChatModel.find({
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
      "archived.isArchived": false,
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve chats",
    };
  }
};

export const updateChat = async (
  chatId: string,
  updateData: any,
  userId: string
) => {
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

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $set: updateData },
      { new: true }
    )
      .populate("members.user", "username email fullName profileImage")
      .populate("createdBy", "username profileImage fullName email");

    return {
      success: true,
      data: updatedChat,
      message: "Chat updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update chat",
    };
  }
};

export const deleteChat = async (chatId: string, userId: string) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
    });
    console.log(chat);

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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete chat",
    };
  }
};

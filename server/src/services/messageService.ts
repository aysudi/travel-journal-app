import { Types } from "mongoose";
import ChatModel from "../models/Chat.js";
import MessageModel from "../models/Message.js";
import formatMongoData from "../utils/formatMongoData.js";

export const getAllMessages = async () => {
  try {
    const messages = await MessageModel.find({})
      .populate("sender", "username email profileImage fullName")
      .populate("seenBy.user", "username email profileImage fullName")
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: formatMongoData(messages),
      message: "All messages retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve all messages",
    };
  }
};

export const createMessage = async (data: any) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(data.chat),
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    const message = new MessageModel({
      chat: new Types.ObjectId(data.chat),
      sender: new Types.ObjectId(data.sender),
      content: data.content,
      list: new Types.ObjectId(data.list),
      status: "sent",
    });

    await message.save();

    await ChatModel.findByIdAndUpdate(data.chat, {
      $set: {
        "lastMessage.message": message._id,
        "lastMessage.timestamp": message.createdAt,
        "lastMessage.sender": message.sender,
        "lastMessage.preview": data.content.substring(0, 100),
      },
      $inc: { messageCount: 1 },
    });

    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "username email")
      .populate("seenBy.user", "username");

    return {
      success: true,
      data: formatMongoData(populatedMessage),
      message: "Message sent successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send message",
    };
  }
};

export const getChatMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = 50
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or access denied",
      };
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      chat: new Types.ObjectId(chatId),
      "deleted.isDeleted": false,
    })
      .populate("sender", "username email profileImage fullName")
      .populate("seenBy.user", "username email profileImage fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await MessageModel.countDocuments({
      chat: new Types.ObjectId(chatId),
      "deleted.isDeleted": false,
    });

    return {
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNextPage: page * limit < totalMessages,
          hasPrevPage: page > 1,
        },
      },
      message: "Messages retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve messages",
    };
  }
};

export const updateMessage = async (
  messageId: string,
  updateData: any,
  userId: string
) => {
  try {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      sender: new Types.ObjectId(userId),
      "deleted.isDeleted": false,
    });

    if (!message) {
      return {
        success: false,
        message: "Message not found or unauthorized",
      };
    }

    if (!message.edited?.isEdited) {
      await MessageModel.findByIdAndUpdate(messageId, {
        $set: {
          "edited.originalContent": message.content,
        },
      });
    }

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          content: updateData.content,
          "edited.isEdited": true,
          "edited.editedAt": new Date(),
        },
      },
      { new: true }
    )
      .populate("sender", "username email profile")
      .populate("seenBy.user", "username profile");

    return {
      success: true,
      data: updatedMessage,
      message: "Message updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update message",
    };
  }
};

export const deleteMessage = async (messageId: string, userId: string) => {
  try {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      sender: new Types.ObjectId(userId),
    });

    if (!message) {
      return {
        success: false,
        message: "Message not found or unauthorized",
      };
    }

    const deletedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          "deleted.isDeleted": true,
          "deleted.deletedAt": new Date(),
          "deleted.deletedBy": new Types.ObjectId(userId),
        },
      },
      { new: true }
    );

    return {
      success: true,
      data: deletedMessage,
      message: "Message deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete message",
    };
  }
};

export const markMessageAsRead = async (messageId: string, userId: string) => {
  try {
    const message = await MessageModel.findById(messageId);

    if (!message) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    const alreadyRead = message.seenBy.some(
      (seen: any) => seen.user.toString() === userId
    );

    if (alreadyRead) {
      return {
        success: true,
        message: "Message already marked as read",
      };
    }

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          seenBy: {
            user: new Types.ObjectId(userId),
            seenAt: new Date(),
          },
        },
        $set: { status: "read" },
      },
      { new: true }
    ).populate("seenBy.user", "username email fullName profileImage");

    return {
      success: true,
      data: updatedMessage,
      message: "Message marked as read",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to mark message as read",
    };
  }
};

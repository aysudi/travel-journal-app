import { NextFunction, Response, Request } from "express";
import {
  createMessage,
  getChatMessages,
  getAllMessages,
  updateMessage,
  deleteMessage,
  markMessageAsRead,
} from "../services/messageService.js";
import { AuthenticatedRequest } from "../types/authType.js";

export const getAllMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllMessages();
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chat, content, sender, list } = req.body;

    if (!chat || !content || !list) {
      return res.status(400).json({
        success: false,
        message: "Chat ID, content, and list are required",
      });
    }

    const response = await createMessage({
      chat,
      sender,
      content,
      list,
    });

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    if (page < 1 || limit < 1 || limit > 1000) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const response = await getChatMessages(chatId, page, limit);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: any = req.query.id;
    const { id: messageId } = req.params;
    const { content } = req.body;

    if (!messageId || !content) {
      return res.status(400).json({
        success: false,
        message: "Message ID and content are required",
      });
    }

    const response = await updateMessage(messageId, { content }, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const removeMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: any = req.query.id;
    const { id: messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const response = await deleteMessage(messageId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.id;
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const response = await markMessageAsRead(messageId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

import { Response, NextFunction, Request } from "express";
import {
  createChat,
  getUserChats,
  getAllChats,
  updateChat,
  deleteChat,
  getOrCreateChatByListId,
} from "../services/chatService";
import { AuthenticatedRequest } from "../types/authType";

export const getAllChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllChats();
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createNewChat = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { members, name, description, createdBy } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Members array is required",
      });
    }

    const allMembers = [...new Set(members)];

    const response = await createChat({
      members: allMembers,
      name,
      description,
      createdBy,
    });

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
    }

    const response = await getUserChats(userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateChatDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.id;
    const { chatId } = req.params;
    const updateData = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const response = await updateChat(chatId, updateData, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteChatById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: any = req.query.userId;
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
  } catch (error) {
    next(error);
  }
};

export const getOrCreateChatByListIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listId = req.query.listId || req.body.listId;
    const userId = req.query.userId || req.body.userId;
    if (!listId || !userId) {
      return res.status(400).json({
        success: false,
        message: "listId and userId are required",
      });
    }
    const response = await getOrCreateChatByListId(
      listId as string,
      userId as string
    );
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

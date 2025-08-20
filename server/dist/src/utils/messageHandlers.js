import { createMessage, deleteMessage, markMessageAsRead, updateMessage, } from "../services/messageService.js";
const validateMessageData = (data) => {
    if (!data.chat || !data.content) {
        return { isValid: false, error: "Chat ID and content are required" };
    }
    if (data.content.length > 1000) {
        return { isValid: false, error: "Message content too long" };
    }
    return { isValid: true };
};
export const registerMessageHandlers = (io, socket) => {
    socket.on("message:send", async (data) => {
        try {
            const validation = validateMessageData(data);
            if (!validation.isValid) {
                socket.emit("error", { message: validation.error });
                return;
            }
            const result = await createMessage({
                ...data,
                sender: socket.user.id,
            });
            if (!result.success || !result.data) {
                socket.emit("error", {
                    message: result.message || "Failed to send message",
                });
                return;
            }
            const message = result.data;
            io.to(`chat:${data.chat}`).emit("message:new", {
                id: message._id?.toString?.() || message._id,
                content: message.content,
                sender: message.sender,
                chatId: data.chat,
                createdAt: message.createdAt,
                seenBy: message.seenBy?.map?.((s) => s.user?.toString?.() || s.user) || [socket.user.id],
                tempId: data.tempId,
            });
        }
        catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });
    socket.on("message:edit", async (data) => {
        try {
            const result = await updateMessage(data.messageId, { content: data.content }, socket.user.id);
            if (!result.success || !result.data) {
                socket.emit("error", {
                    message: result.message || "Failed to edit message",
                });
                return;
            }
            const message = result.data;
            io.to(`chat:${message.chat}`).emit("message:updated", {
                id: message._id.toString(),
                content: message.content,
                senderId: socket.user.id,
                senderName: socket.user.username,
                chatId: message.chat.toString(),
                timestamp: message.createdAt,
                editedAt: message.updatedAt,
                seenBy: message.seenBy.map((id) => id.toString()),
            });
        }
        catch (error) {
            console.error("Error editing message:", error);
            socket.emit("error", { message: "Failed to edit message" });
        }
    });
    socket.on("message:delete", async (data) => {
        try {
            const result = await deleteMessage(data.messageId, socket.user.id);
            if (!result.success || !result.data) {
                socket.emit("error", {
                    message: result.message || "Failed to delete message",
                });
                return;
            }
            const message = result.data;
            io.to(`chat:${message.chat}`).emit("message:deleted", {
                messageId: data.messageId,
                chatId: message.chat.toString(),
            });
        }
        catch (error) {
            console.error("Error deleting message:", error);
            socket.emit("error", { message: "Failed to delete message" });
        }
    });
    socket.on("message:typing", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message:typing", {
            userId: socket.user.id,
            username: socket.user.username,
            chatId: data.chatId,
        });
    });
    socket.on("message:stopTyping", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message:stopTyping", {
            userId: socket.user.id,
            username: socket.user.username,
            chatId: data.chatId,
        });
    });
    socket.on("message:markAsRead", async (data) => {
        try {
            const result = await markMessageAsRead(data.messageId, socket.user.id);
            if (result.success) {
                io.to(`chat:${data.chatId}`).emit("message:read", {
                    messageId: data.messageId,
                    chatId: data.chatId,
                    userId: socket.user.id,
                });
            }
        }
        catch (error) {
            console.error("Error marking message as read:", error);
        }
    });
};

import { useUserProfile } from "../../../hooks/useAuth";
import { useMessagesByChat } from "../../../hooks/useMessages";
import { useEffect, useRef, useState } from "react";
import { Send, X, Sticker, Edit2 } from "lucide-react";
import connectSocket from "../../../services/socket";
import GifPicker from "../GifPicker";
import { useUpdateChat } from "../../../hooks/useChats";
import Swal from "sweetalert2";
import Messages from "./Messages";
import GroupEditModal from "./GroupEditModal";

interface Message {
  _id?: string;
  content: string;
  createdAt?: string;
  sender?: { _id: string; username: string; profileImage?: string };
  edited?: {
    isEdited: boolean;
    editedAt?: string;
    originalContent?: string;
  };
}

const ChatCard = ({ setChatOpen, chat, listId, refetchChat }: any) => {
  const [editData, setEditData] = useState<{
    name: string;
    description: string;
    avatar: string | File;
  }>({
    name: chat.name,
    description: chat.description,
    avatar: chat.avatar,
  });
  const [showGroupEdit, setShowGroupEdit] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const { data: user } = useUserProfile();
  const {
    data: messagesData,
    isLoading,
    refetch,
  } = useMessagesByChat(chat.id, user?.id ? { userId: user.id } : undefined);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = connectSocket();
  const [showGifPicker, setShowGifPicker] = useState(false);
  const updateChat = useUpdateChat();

  useEffect(() => {
    refetch();
    if (!chat.id) return;
    socket.emit("join:chats", [chat.id]);
    const handleNewMessage = (msg: any) => {
      const msgChatId = msg.chatId || msg.chat;
      if (msgChatId === chat.id) {
        refetch();
      }
    };
    const handleUpdatedMessage = (msg: any) => {
      const msgChatId = msg.chatId || msg.chat;
      if (msgChatId === chat.id) {
        setEditingMsgId(null);
        setMessage("");
        refetch();
      }
    };
    const handleDeletedMessage = (msg: any) => {
      const msgChatId = msg.chatId || msg.chat;
      if (msgChatId === chat.id) {
        refetch();
      }
    };
    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleUpdatedMessage);
    socket.on("message:deleted", handleDeletedMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleUpdatedMessage);
      socket.off("message:deleted", handleDeletedMessage);
    };
  }, [chat.id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    if (editingMsgId) {
      socket.emit("message:edit", {
        messageId: editingMsgId,
        content: message,
      });
    } else {
      socket.emit("message:send", {
        chat: chat.id,
        content: message,
        list: listId,
        tempId: Date.now().toString(),
      });
      setMessage("");
    }
  };

  const handleEditMessage = (msg: Message) => {
    setEditingMsgId(msg._id || "");
    setMessage(msg.content);
  };

  const sendGifMessage = (gifUrl: string) => {
    if (!gifUrl || !chat) return;
    socket.emit("message:send", {
      chat: chat.id,
      content: gifUrl,
      list: listId,
      tempId: Date.now().toString(),
      isGif: true,
    });
    setShowGifPicker(false);
  };

  const handleEditChat = async () => {
    if (!chat.id) return;
    try {
      const data = new FormData();
      data.append("name", editData.name ?? "");
      data.append("description", editData.description ?? "");
      if (editData.avatar instanceof File) {
        data.append("avatar", editData.avatar);
      }
      await updateChat.mutateAsync({
        id: chat.id,
        data,
      });
      Swal.fire({
        title: "Chat updated successfully!",
        icon: "success",
        draggable: true,
      });
      refetchChat();
      setShowGroupEdit(false);
    } catch (error) {
      console.error("Failed to update chat:", error);
    }
  };

  const messages: Message[] =
    (messagesData && (messagesData as any)?.messages) || [];

  return (
    <div className="w-full max-w-6xl min-w-[450px] md:min-w-[750px] h-[80vh] flex flex-col rounded-3xl shadow-2xl bg-white/60 backdrop-blur-2xl border border-white/40 overflow-hidden relative">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/70 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 shadow transition cursor-pointer"
        onClick={() => setChatOpen(false)}
        aria-label="Close chat"
      >
        <X size={22} />
      </button>
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-6 border-b border-white/30 bg-white/40 backdrop-blur-md relative">
        {chat.avatar ? (
          <img
            className="w-11 h-11 rounded-full object-cover border border-indigo-200"
            src={chat.avatar}
            alt={editData.description}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
            💬
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-bold text-lg text-gray-900">
            {editData.name || "Group Chat"}
          </div>
          <div className="text-xs text-gray-500">
            {editData.description || "Connect & share with your friends"}
          </div>
        </div>
        <button
          className="absolute right-16 top-[35px] -translate-y-1/2 p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition shadow cursor-pointer"
          onClick={() => setShowGroupEdit(true)}
          aria-label="Edit group"
        >
          <Edit2 size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white/60 to-indigo-100">
        {isLoading ? (
          <div className="text-center text-gray-400 mt-10">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = user && msg.sender?._id === user.id;
            return (
              <Messages
                editingMsgId={editingMsgId}
                handleEditMessage={handleEditMessage}
                isSelf={isSelf}
                msg={msg}
              />
            );
          })
        )}
        {/* Group Edit Modal */}
        {showGroupEdit && (
          <GroupEditModal
            setEditData={setEditData}
            handleEditChat={handleEditChat}
            setShowGroupEdit={setShowGroupEdit}
            editData={editData}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Message Input */}
      <form
        onSubmit={handleSend}
        className="relative flex items-center gap-3 px-6 py-5 bg-white/70 backdrop-blur-xl border-t border-white/30"
      >
        <button
          onClick={() => setShowGifPicker(true)}
          className="px-2 py-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          type="button"
        >
          <Sticker className="w-5 h-5" />
        </button>

        {showGifPicker && (
          <GifPicker
            onSelect={(gifUrl: string) => sendGifMessage(gifUrl)}
            onClose={() => setShowGifPicker(false)}
          />
        )}

        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white text-gray-900 shadow"
          placeholder={
            editingMsgId ? "Edit your message…" : "Type your message…"
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
        />
        {editingMsgId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition shadow cursor-pointer"
            onClick={() => {
              setEditingMsgId(null);
              setMessage("");
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="ml-2 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition shadow cursor-pointer"
          disabled={!message.trim() || !user}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatCard;

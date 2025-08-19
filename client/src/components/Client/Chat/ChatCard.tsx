import { useUserProfile } from "../../../hooks/useAuth";
import { useMessagesByChat } from "../../../hooks/useMessages";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  X,
  Sticker,
  Edit2,
  Trash2,
  Camera,
  MoreHorizontal,
} from "lucide-react";
import connectSocket from "../../../services/socket";
import GifPicker from "../GifPicker";

interface Message {
  _id?: string;
  content: string;
  createdAt?: string;
  sender?: { _id: string; username: string; profileImage?: string };
}

const ChatCard = ({ setChatOpen, chat, listId }: any) => {
  const [showGroupEdit, setShowGroupEdit] = useState(false);
  const [groupName, setGroupName] = useState(chat.name || "");
  const [groupDesc, setGroupDesc] = useState(chat.description || "");
  const [groupAvatar, setGroupAvatar] = useState(chat.avatar || "");
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
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

  const handleDeleteMessage = (msg: Message) => {
    if (!msg._id) return;
    socket.emit("message:delete", { messageId: msg._id });
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

  const messages: Message[] =
    (messagesData && (messagesData as any)?.messages) || [];

  return (
    <div className="w-full max-w-5xl min-w-[350px] md:min-w-[600px] h-[80vh] flex flex-col rounded-3xl shadow-2xl bg-white/60 backdrop-blur-2xl border border-white/40 overflow-hidden relative">
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
        {groupAvatar ? (
          <img
            className="w-11 h-11 rounded-full object-cover border border-indigo-200"
            src={groupAvatar}
            alt={groupDesc}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
            💬
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-bold text-lg text-gray-900">
            {groupName || "Group Chat"}
          </div>
          <div className="text-xs text-gray-500">
            {groupDesc || "Connect & share with your friends"}
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
          messages.map((msg, idx) => {
            const isSelf = user && msg.sender?._id === user.id;
            return (
              <div
                key={msg._id || idx}
                className={`flex mb-2 group ${
                  isSelf ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end max-w-[70%] ${
                    isSelf ? "flex-row-reverse" : ""
                  }`}
                  style={{ gap: isSelf ? 32 : 8 }}
                >
                  <img
                    src={
                      msg.sender?.profileImage ||
                      "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                    }
                    alt={msg.sender?.username || "User"}
                    className={`w-8 h-8 rounded-full object-cover border-2 border-indigo-200 bg-white shadow ${
                      isSelf ? "ml-1" : "mr-1"
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";
                    }}
                  />
                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-md text-base break-words ${
                      isSelf
                        ? "bg-indigo-500 text-white rounded-br-md"
                        : "bg-white/90 text-gray-900 border border-indigo-100 rounded-bl-md"
                    }`}
                  >
                    {/* Edit/Delete options for own messages */}
                    {isSelf && (
                      <div className="absolute top-1 right-[-28px] z-10">
                        <button
                          className="p-1 rounded-full hover:bg-indigo-100 focus:outline-none cursor-pointer"
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === msg._id ? null : msg._id || ""
                            )
                          }
                          aria-label="Message actions"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {actionMenuOpen === msg._id && (
                          <div className="absolute z-10 right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fade-in">
                            {msg.content.match(
                              /https?:\/\/.*\.(gif)(\?.*)?$/i
                            ) ? (
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                onClick={() => {
                                  handleDeleteMessage(msg);
                                  setActionMenuOpen(null);
                                }}
                              >
                                <Trash2 size={15} /> Delete
                              </button>
                            ) : (
                              <>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                                  onClick={() => {
                                    handleEditMessage(msg);
                                    setActionMenuOpen(null);
                                  }}
                                >
                                  <Edit2 size={15} /> Edit
                                </button>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                  onClick={() => {
                                    handleDeleteMessage(msg);
                                    setActionMenuOpen(null);
                                  }}
                                >
                                  <Trash2 size={15} /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Render GIF if content is a gif url, else render text */}
                    {editingMsgId === msg._id ? null : msg.content.match(
                        /https?:\/\/.*\.(gif)(\?.*)?$/i
                      ) ? (
                      <img
                        src={msg.content}
                        alt="GIF"
                        className="max-w-xs max-h-60 rounded-lg border border-indigo-200"
                        style={{ display: "block", margin: "0 auto" }}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : (
                      msg.content
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>
                        {isSelf ? "You" : msg.sender?.username || "User"}
                      </span>
                      <span>·</span>
                      <span>
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {/* Group Edit Modal */}
        {showGroupEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowGroupEdit(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">
                Edit Group Info
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2">
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer relative group"
                  >
                    {groupAvatar ? (
                      <img
                        src={groupAvatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-indigo-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400">
                        <Camera size={32} />
                      </div>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setGroupAvatar(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <span className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition">
                      Edit
                    </span>
                  </label>
                </div>
                <input
                  className="px-3 py-2 rounded border border-indigo-200"
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <textarea
                  className="px-3 py-2 rounded border border-indigo-200 min-h-[60px]"
                  placeholder="Description"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                />
                <button
                  className="mt-2 px-4 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
                  onClick={() => setShowGroupEdit(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
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

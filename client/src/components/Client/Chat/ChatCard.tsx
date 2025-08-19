import { useUserProfile } from "../../../hooks/useAuth";
import { useMessagesByChat } from "../../../hooks/useMessages";
import { useEffect, useRef, useState } from "react";
import { Send, X, Sticker } from "lucide-react";
import connectSocket from "../../../services/socket";
import GifPicker from "../GifPicker";

interface Message {
  _id?: string;
  content: string;
  createdAt?: string;
  sender?: { _id: string; username: string; profileImage?: string };
}

const ChatCard = ({ setChatOpen, chat, listId }: any) => {
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
        refetch().then();
      }
    };
    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [chat.id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    socket.emit("message:send", {
      chat: chat.id,
      content: message,
      list: listId,
      tempId: Date.now().toString(),
    });
    setMessage("");
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
      <div className="flex items-center gap-3 px-8 py-6 border-b border-white/30 bg-white/40 backdrop-blur-md">
        {chat.avatar && chat.avatar.length > 0 ? (
          <img
            className="w-11 h-11 rounded-full"
            src={chat.avatar}
            alt={chat.description}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
            💬
          </div>
        )}

        <div>
          {chat.description && chat.description.length > 0 ? (
            <div className="font-bold text-lg text-gray-900">
              {chat.description}
            </div>
          ) : (
            <div className="font-bold text-lg text-gray-900">Group Chat</div>
          )}
          <div className="text-xs text-gray-500">
            Connect & share with your friends
          </div>
        </div>
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
                className={`flex mb-2 ${
                  isSelf ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[70%] ${
                    isSelf ? "flex-row-reverse" : ""
                  }`}
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
                    className={`px-4 py-2 rounded-2xl shadow-md text-base break-words
                        ${
                          isSelf
                            ? "bg-indigo-500 text-white rounded-br-md"
                            : "bg-white/90 text-gray-900 border border-indigo-100 rounded-bl-md"
                        }
                      `}
                  >
                    {/* Render GIF if content is a gif url, else render text */}
                    {msg.content.match(/https?:\/\/.*\.(gif)(\?.*)?$/i) ? (
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
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
        />
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

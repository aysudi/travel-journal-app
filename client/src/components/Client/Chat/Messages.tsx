import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import connectSocket from "../../../services/socket";

type Props = {
  isSelf: boolean | undefined;
  msg: Message;
  editingMsgId: string | null;
  handleEditMessage: any;
};

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

const Messages = ({ isSelf, msg, handleEditMessage, editingMsgId }: Props) => {
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const socket = connectSocket();

  const handleDeleteMessage = (msg: Message) => {
    if (!msg._id) return;
    socket.emit("message:delete", { messageId: msg._id });
  };

  return (
    <div
      key={msg._id}
      className={`flex mb-2 group ${isSelf ? "justify-end" : "justify-start"}`}
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
                    actionMenuOpen === msg._id ? null : msg._id || "",
                  )
                }
                aria-label="Message actions"
              >
                <MoreHorizontal size={18} />
              </button>
              {actionMenuOpen === msg._id && (
                <div className="absolute z-10 right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fade-in">
                  {msg.content.match(/https?:\/\/.*\.(gif)(\?.*)?$/i) ? (
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
              /https?:\/\/.*\.(gif)(\?.*)?$/i,
            ) ? (
            <img
              src={msg.content}
              alt="GIF"
              className="max-w-xs max-h-60 rounded-lg border border-indigo-200"
              style={{ display: "block", margin: "0 auto" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            msg.content
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>{isSelf ? "You" : msg.sender?.username || "User"}</span>
            <span>·</span>
            <span>
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
            {msg.edited?.isEdited && (
              <>
                <span>·</span>
                <span
                  className="italic text-gray-400 hover:text-indigo-500 cursor-help transition"
                  title={
                    msg.edited.editedAt
                      ? `Edited at ${new Date(
                          msg.edited.editedAt,
                        ).toLocaleString()}`
                      : "Edited"
                  }
                >
                  (edited)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

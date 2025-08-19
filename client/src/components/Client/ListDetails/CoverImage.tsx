import {
  Camera,
  Globe,
  Lock,
  MoreVertical,
  UserCheck,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import ChatCard from "../Chat/ChatCard";
import { useGetOrCreateChatByListId } from "../../../hooks/useChats";
import { useUserProfile } from "../../../hooks/useAuth";

type Props = {
  travelList: any;
  handleCoverImageUpload: () => void;
};

const CoverImage = ({ travelList, handleCoverImageUpload }: Props) => {
  const [chatOpen, setChatOpen] = useState(false);
  const { data: user }: any = useUserProfile();

  const {
    data,
    isLoading,
    error,
  }: { data: any; isLoading: boolean; error: any } = useGetOrCreateChatByListId(
    travelList._id,
    user?.id
  );

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Error loading chat</div>;

  const chat: string = data;

  return (
    <div className="relative h-140 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {travelList?.coverImage ? (
        <img
          src={travelList.coverImage}
          alt={travelList.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Cover Image Actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleCoverImageUpload}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
        >
          <Camera size={20} />
        </button>
        <button
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle size={20} />
        </button>
        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* ChatCard Modal Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative">
            <ChatCard
              listId={travelList._id}
              chat={chat}
              setChatOpen={setChatOpen}
            />
          </div>
        </div>
      )}

      {/* List Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-2 mb-2">
          {travelList?.visibility === "public" ? (
            <Globe size={16} className="text-white/80" />
          ) : travelList?.visibility === "friends" ? (
            <UserCheck size={16} className="text-white/80" />
          ) : (
            <Lock size={16} className="text-white/80" />
          )}
          <span className="text-white/80 text-sm capitalize">
            {travelList?.visibility || "Private"} List
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {travelList?.title}
        </h1>
        {travelList?.description && (
          <p className="text-white/90 text-lg max-w-2xl">
            {travelList.description}
          </p>
        )}

        {/* Tags */}
        {travelList?.tags && travelList.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {travelList.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;

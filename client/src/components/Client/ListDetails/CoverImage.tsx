import {
  Camera,
  Globe,
  Lock,
  UserCheck,
  MessageCircle,
  Trash2,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import ChatCard from "../Chat/ChatCard";
import { useGetOrCreateChatByListId } from "../../../hooks/useChats";
import { useUserProfile } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  useDeleteTravelList,
  useUploadCoverImage,
} from "../../../hooks/useTravelList";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Props = {
  travelList: any;
  isOwner: boolean;
};

const CoverImage = ({ travelList, isOwner }: Props) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user }: any = useUserProfile();
  const deleteList = useDeleteTravelList();
  const uploadCoverImage = useUploadCoverImage();
  const queryClient = useQueryClient();
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    refetch: refetchChat,
  }: any = useGetOrCreateChatByListId(travelList._id, user?.id);

  const chat: string = data;

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      try {
        await uploadCoverImage.mutateAsync({ listId: travelList._id, file });
        setCoverImagePreview("");
        queryClient.invalidateQueries({
          queryKey: ["travel-list", travelList._id],
        });
        Swal.fire({
          icon: "success",
          title: "Cover image updated!",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "You don't have permission to upload images",
          text: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
  };

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setMenuOpen(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteList.mutateAsync(travelList._id);
        Swal.fire({
          title: "Deleted!",
          text: "Your travel list has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/explore");
      }
    });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <div className="relative h-140 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Loading/Error States */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 text-white text-lg font-semibold"></div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 text-white text-lg font-semibold"></div>
      )}
      {coverImagePreview ? (
        <img
          src={coverImagePreview}
          alt="Cover preview"
          className="w-full h-full object-cover"
        />
      ) : travelList?.coverImage ? (
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
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        {isOwner && (
          <>
            <button
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleImageChange}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
            >
              <Camera size={20} />
            </button>
            {/* Hidden file input for image upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleCoverImageUpload}
            />
          </>
        )}
        <button
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle size={20} />
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
              refetchChat={refetchChat}
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

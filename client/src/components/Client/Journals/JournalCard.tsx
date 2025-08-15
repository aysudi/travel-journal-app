import {
  Camera,
  Heart,
  MessageSquare,
  MoreVertical,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserProfile } from "../../../hooks/useAuth";
import { useToggleJournalEntryLike } from "../../../hooks/useEntries";
import { Link } from "react-router";
import type { JournalEntryCard } from "../../../services";
import Loading from "../../Common/Loading";

const JournalCard = ({ journal }: { journal: JournalEntryCard }) => {
  const { data: user, isLoading: isLoadingUser } = useUserProfile();
  const listId = journal.destination?.list?._id;
  const toggleLike = useToggleJournalEntryLike(listId);
  const [likes, setLikes] = useState<typeof journal.likes>(journal.likes);
  const [likeCount, setLikeCount] = useState(journal.likes.length);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    setLikes(journal.likes);
    setLikeCount(journal.likes.length);
  }, [journal.likes]);

  if (!listId) return null;
  if (isLoadingUser) {
    return <Loading variant="page" />;
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
      {/* Header - Author Info */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            {journal.author.profileImage ? (
              <img
                src={journal.author.profileImage}
                alt={journal.author.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-indigo-100">
                <span className="text-white font-semibold text-sm">
                  {journal.author.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>

          <div>
            <p className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
              {journal.author.fullName}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>@{journal.author.username}</span>
              <span>•</span>
              <span>{formatTimeAgo(journal.createdAt)}</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Title and Content */}
      <div className="px-4 pb-3">
        <Link
          to={`/journals/${journal.id}`}
          className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          {journal.title}
        </Link>
        <div className="text-gray-700 leading-relaxed">
          <p className={showFullContent ? "" : "line-clamp-3"}>
            {journal.content}
          </p>
          {journal.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-indigo-600 hover:text-indigo-700 font-medium mt-1 text-sm transition-colors duration-200"
            >
              {showFullContent ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {journal.photos.length > 0 && (
        <div className="px-4 pb-3">
          {journal.photos.length === 1 ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={journal.photos[0]}
                alt={journal.title}
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />1
              </div>
            </div>
          ) : journal.photos.length === 2 ? (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {journal.photos.slice(0, 2).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`${journal.title} ${index + 1}`}
                    className="w-full h-60 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />
                {journal.photos.length}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
              {journal.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`${journal.title} ${index + 1}`}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {index === 2 && journal.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{journal.photos.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />
                {journal.photos.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {journal.tags && journal.tags.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {journal.tags.slice(0, 4).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {journal.tags.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{journal.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (!user || toggleLike.isPending) return;
              const hasLiked = likes.includes(user.id);
              let newLikes;
              if (hasLiked) {
                newLikes = likes.filter((id) => id !== user.id);
              } else {
                newLikes = [...likes, user.id];
              }
              setLikes(newLikes);
              setLikeCount(newLikes.length);
              toggleLike.mutate(journal.id, {
                onSuccess: (data: any) => {
                  if (
                    data &&
                    data.journalEntry &&
                    Array.isArray(data.journalEntry.likes)
                  ) {
                    setLikes(data.journalEntry.likes);
                    setLikeCount(data.journalEntry.likes.length);
                  }
                },
                onError: () => {
                  setLikes(journal.likes);
                  setLikeCount(journal.likes.length);
                },
              });
            }}
            disabled={toggleLike.isPending}
            className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              user && likes.includes(user.id)
                ? "text-red-500 bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            } ${toggleLike.isPending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                user && likes.includes(user.id) ? "fill-current" : ""
              }`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          <Link
            to={`/journals/${journal.id}`}
            className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200"
          >
            <MessageSquare size={18} />
            <span className="text-sm font-medium">
              {journal.comments.length}
            </span>
          </Link>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalCard;

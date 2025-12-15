import {
  Camera,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useUserProfile } from "../../../hooks/useAuth";
import { useToggleJournalEntryLike } from "../../../hooks/useEntries";
import { Link, useNavigate } from "react-router";
import type { JournalEntryCard } from "../../../services";
import Loading from "../../Common/Loading";

interface JournalCardProps {
  journal: JournalEntryCard;
  showPrivacyIndicator?: boolean;
}

const JournalCard = ({
  journal,
  showPrivacyIndicator = false,
}: JournalCardProps) => {
  const { data: user, isLoading: isLoadingUser } = useUserProfile();
  const listId = journal.destination?.list?._id;
  const toggleLike = useToggleJournalEntryLike(listId);
  const [showFullContent, setShowFullContent] = useState(false);
  const hasLiked = user ? journal.likes.includes(user.id) : false;
  const navigate = useNavigate();

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

        {/* Privacy Indicator - Only show in My Journals */}
        {showPrivacyIndicator && (
          <div className="flex items-center gap-2">
            {journal.public ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <Eye size={12} />
                <span>Public</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                <EyeOff size={12} />
                <span>Private</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Destination Info & Go to List Button */}
      {(journal.destination || listId) && (
        <div className="px-4 pb-1 flex items-center gap-2 text-sm text-indigo-700 font-medium">
          {journal.destination && (
            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {typeof journal.destination === "object" &&
              journal.destination !== null ? (
                <>
                  <span>{(journal.destination as any).name}</span>
                  {(journal.destination as any).location && (
                    <span className="text-gray-500">{`(${
                      (journal.destination as any).location
                    })`}</span>
                  )}
                </>
              ) : (
                <span>Destination</span>
              )}
            </span>
          )}
          {/* Go to List Button */}
          {listId && (
            <Link
              to={`/lists/${listId}`}
              className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-900 transition-colors duration-200 text-xs font-semibold shadow-sm z-30"
              title="Go to List"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Go to List
            </Link>
          )}
        </div>
      )}

      {/* Title and Content */}
      <div className="px-4 pb-3">
        <div
          className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors cursor-pointer"
          onClick={() => {
            navigate(`/journals/${journal.id}`);
          }}
        >
          {journal.title}
        </div>
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
              toggleLike.mutate(journal.id);
            }}
            disabled={toggleLike.isPending || !user}
            className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              user && hasLiked
                ? "text-red-500 bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            } ${toggleLike.isPending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                user && hasLiked ? "fill-current" : ""
              }`}
            />
            <span className="text-sm font-medium">{journal.likes.length}</span>
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

import { useState } from "react";
import type { Comment as CommentType } from "../../../types/api";
import {
  useCommentStats,
  useDeleteComment,
  useToggleCommentLike,
} from "../../../hooks/useComments";
import Swal from "sweetalert2";
import { Clock, Heart, Reply, Send, Trash2 } from "lucide-react";
import { Link } from "react-router";
import formatTimeAgo from "../../../utils/formatTimeAgo";

const CommentItem = ({
  comment,
  currentUser,
}: {
  comment: CommentType;
  currentUser: any;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { likeCount, isLikedByUser, isOwnComment } = useCommentStats(
    comment,
    currentUser?.id
  );

  const toggleLike = useToggleCommentLike();
  const deleteCommentMutation = useDeleteComment();

  const handleLikeToggle = () => {
    toggleLike.mutate(comment.id);
  };

  const handleDeleteComment = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommentMutation.mutate(comment.id);

        Swal.fire({
          title: "Deleted!",
          text: "Your comment has been deleted.",
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="p-6 hover:bg-gray-50/30 transition-colors duration-200">
      <div className="flex gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {comment.author?.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author?.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center ring-2 ring-gray-100">
              <span className="text-white font-semibold text-sm">
                {comment.author?.fullName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              to={`/profile/${comment.author?._id}`}
              className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
            >
              {comment.author?.fullName || "Anonymous"}
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              @{comment.author?.username || "unknown"}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={12} />
              <span>{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>

          {/* Comment Text */}
          <div className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
            {comment.content}
          </div>

          {/* Comment Photos */}
          {comment.photos.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-md">
                {comment.photos.map((photo: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`Comment attachment ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                isLikedByUser
                  ? "text-red-500 bg-red-50"
                  : "text-gray-500 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart
                size={14}
                className={`transition-all duration-200 ${
                  isLikedByUser ? "fill-current" : ""
                }`}
              />
              <span className="font-medium">{likeCount}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            >
              <Reply size={14} />
              <span className="font-medium">Reply</span>
            </button>

            {isOwnComment && (
              <button
                onClick={handleDeleteComment}
                title="Delete comment"
                className="text-gray-400 hover:text-red-600 text-sm transition-colors duration-200 p-1 rounded-full hover:bg-red-50 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 pl-4 border-l-2 border-gray-100">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {currentUser?.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-indigo-100">
                      <span className="text-white font-semibold text-xs">
                        {currentUser?.fullName[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${
                      comment.author?.fullName || "user"
                    }...`}
                    className="w-full p-3 bg-gray-50 border border-gray-200/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-gray-400 text-sm"
                    rows={2}
                    maxLength={250}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {replyText.length}/250
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText("");
                        }}
                        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!replyText.trim()}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Send size={12} />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

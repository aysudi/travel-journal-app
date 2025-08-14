import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  MapPin,
  Calendar,
  Camera,
  Globe,
  Lock,
  MoreHorizontal,
  ExternalLink,
  Clock,
  BookOpen,
  Send,
  Image,
  Smile,
  Reply,
  Trash2,
} from "lucide-react";
import { useJournalEntry } from "../../hooks/useEntries";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useCommentsByJournal,
  useCreateComment,
  useDeleteComment,
  useToggleCommentLike,
  useCommentForm,
  useCommentStats,
} from "../../hooks/useComments";
import type { Comment as CommentType } from "../../types/api";
import Loading from "../../components/Common/Loading";
import Swal from "sweetalert2";

const JournalDetails = () => {
  const { journalId } = useParams<{ journalId: string }>();
  const navigate = useNavigate();
  const { data: user } = useUserProfile();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const {
    data: journal,
    isLoading,
    error,
    refetch,
  } = useJournalEntry(journalId || "");

  const { data: comments = [] } = useCommentsByJournal(journalId || "");

  const commentForm = useCommentForm();
  const createComment = useCreateComment();

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatTimeAgo = useCallback((dateString: string) => {
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
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share && journal) {
      navigator
        .share({
          title: journal.title,
          text: `Check out this travel story: ${journal.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      setShowShareModal(true);
    }
  }, [journal]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, []);

  const handleSubmitComment = useCallback(async () => {
    if (!commentForm.isValid || !journalId) return;

    commentForm.setIsSubmitting(true);
    try {
      await createComment.mutateAsync({
        content: commentForm.content,
        journalEntry: journalId,
        photos: [],
      });
      commentForm.reset();
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      commentForm.setIsSubmitting(false);
    }
  }, [commentForm, createComment, journalId]);

  if (isLoading) {
    return <Loading variant="page" />;
  }

  if (error || !journal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <p className="text-lg font-medium">
              {error ? "Failed to load journal" : "Journal not found"}
            </p>
            <p className="text-sm mt-1">
              {error
                ? "Please try again later."
                : "This journal may have been deleted or is not public."}
            </p>
            <div className="mt-4 space-x-3">
              <button
                onClick={() => navigate("/journals")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Browse Journals
              </button>
              {error && (
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {journal.isPublic ? (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Globe size={16} />
                  <span>Public</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Lock size={16} />
                  <span>Private</span>
                </div>
              )}

              {user?.id === journal.author._id && (
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <MoreHorizontal size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Author Header */}
          <div className="p-6 border-b border-gray-100/80">
            <div className="flex items-center justify-between">
              <Link
                to={`/profile/${journal.author._id}`}
                className="flex items-center gap-4 group"
              >
                <div className="relative">
                  {journal.author.profileImage ? (
                    <img
                      src={journal.author.profileImage}
                      alt={journal.author.fullName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-200">
                      <span className="text-white font-semibold">
                        {journal.author.fullName[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {journal.author.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>@{journal.author.username}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatTimeAgo(journal.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Title */}
          <div className="p-6 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {journal.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(journal.createdAt)}</span>
              </div>

              {journal.destination && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
              )}

              {journal.photos.length > 0 && (
                <div className="flex items-center gap-2">
                  <Camera size={16} />
                  <span>
                    {journal.photos.length} photo
                    {journal.photos.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {journal.photos.length > 0 && (
            <div className="mb-6">
              {journal.photos.length === 1 ? (
                <div className="px-6">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={journal.photos[0]}
                      alt={journal.title}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="px-6">
                  {/* Main Image */}
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={journal.photos[selectedImageIndex]}
                      alt={`${journal.title} ${selectedImageIndex + 1}`}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {journal.photos.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {(showAllPhotos
                      ? journal.photos
                      : journal.photos.slice(0, 8)
                    ).map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                          selectedImageIndex === index
                            ? "ring-2 ring-indigo-500 opacity-100"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`${journal.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}

                    {!showAllPhotos && journal.photos.length > 8 && (
                      <button
                        onClick={() => setShowAllPhotos(true)}
                        className="aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 transition-colors duration-200"
                      >
                        +{journal.photos.length - 8}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 pt-2">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                style={{ lineHeight: "1.7" }}
              >
                {journal.content}
              </div>
            </div>
          </div>

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {journal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isLiked
                    ? "text-red-500 bg-red-50"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart
                  size={18}
                  className={`transition-all duration-200 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
                <span className="text-sm font-medium">Like</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <MessageSquare size={18} />
                <span className="text-sm font-medium">
                  {comments.length} Comment
                  {comments.length !== 1 ? "s" : ""}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            <Link
              to="/journals"
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-all duration-200"
            >
              <BookOpen size={16} />
              <span className="text-sm font-medium">More Stories</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </article>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* Comments Header */}
            <div className="p-6 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Comments ({comments.length})
                </h2>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Add Comment Form */}
            {user && (
              <div className="p-6 border-b border-gray-100/80">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-indigo-100">
                        <span className="text-white font-semibold text-sm">
                          {user.fullName[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <textarea
                      value={commentForm.content}
                      onChange={(e) => commentForm.setContent(e.target.value)}
                      placeholder="Share your thoughts about this journey..."
                      className="w-full p-4 bg-gray-50 border border-gray-200/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-gray-400"
                      rows={3}
                      maxLength={500}
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-200">
                          <Image size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-200">
                          <Smile size={18} />
                        </button>
                        <span className="text-xs text-gray-400 ml-2">
                          {commentForm.content.length}/500
                        </span>
                      </div>

                      <button
                        disabled={
                          !commentForm.isValid || commentForm.isSubmitting
                        }
                        onClick={handleSubmitComment}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                      >
                        <Send size={16} />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="divide-y divide-gray-100/80">
              {comments.map((comment, idx) => (
                <CommentItem
                  key={comment.id || `temp-${idx}`}
                  comment={comment}
                  currentUser={user}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>

            {/* Load More Comments */}
            {comments.length > 0 && (
              <div className="p-4 text-center border-t border-gray-100/80">
                <button className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                  Load more comments
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Share this story
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ExternalLink size={20} className="text-gray-600" />
                <span className="font-medium text-gray-800">Copy Link</span>
              </button>

              {/* Add more share options here if needed */}
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Item Component
const CommentItem = ({
  comment,
  currentUser,
  formatTimeAgo,
}: {
  comment: CommentType;
  currentUser: any;
  formatTimeAgo: (date: string) => string;
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

export default JournalDetails;

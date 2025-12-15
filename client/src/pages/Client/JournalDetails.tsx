import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Camera, ExternalLink, BookOpen } from "lucide-react";
import { useJournalEntry } from "../../hooks/useEntries";
import { useUserProfile } from "../../hooks/useAuth";
import { useCommentsByJournal } from "../../hooks/useComments";
import Loading from "../../components/Common/Loading";
import CommentItem from "../../components/Client/Journals/CommentItem";
import ShareModal from "../../components/Client/Journals/ShareModal";
import CommentForm from "../../components/Client/Journals/CommentForm";
import ActionsBar from "../../components/Client/Journals/ActionsBar";
import AuthorHeader from "../../components/Client/Journals/AuthorHeader";
import PhotosSection from "../../components/Client/Journals/PhotosSection";
import Header from "../../components/Client/Journals/Header";

const JournalDetails = () => {
  const { journalId } = useParams<{ journalId: string }>();
  const navigate = useNavigate();
  const { data: user }: any = useUserProfile();
  const {
    data: journal,
    isLoading,
    error,
    refetch,
  } = useJournalEntry(journalId || "");

  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const { data: comments = [] } = useCommentsByJournal(journalId || "");
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

  if (!journalId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <p className="text-lg font-medium">No journal ID provided</p>
            <button
              onClick={() => navigate("/journals")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Browse Journals
            </button>
          </div>
        </div>
      </div>
    );
  }
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
      <Header />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Author Header */}
          <AuthorHeader journal={journal} />

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
                  <span>{journal.destination?.location}</span>
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
          {journal.photos.length > 0 && <PhotosSection journal={journal} />}

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
            <ActionsBar
              journal={journal}
              user={user}
              setShowShareModal={setShowShareModal}
              comments={comments}
              setShowComments={setShowComments}
              showComments={showComments}
              refetchJournal={refetch}
            />

            <Link
              to="/journals"
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-all duration-200"
            >
              <BookOpen size={16} />
              <span className="text-sm font-medium">More Stories</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* Comments Header */}
            <div className="p-6 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Comments ({comments.length})
                </h2>
              </div>
            </div>

            {/* Add Comment Form */}
            {user && <CommentForm user={user} journalId={journalId} />}

            {/* Comments List */}
            <div className="divide-y divide-gray-100/80">
              {comments.map((comment, idx) => (
                <CommentItem
                  key={comment.id || `temp-${idx}`}
                  comment={comment}
                  currentUser={user}
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
      {showShareModal && <ShareModal setShowShareModal={setShowShareModal} />}
    </div>
  );
};

export default JournalDetails;

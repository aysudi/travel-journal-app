import { Heart, MessageSquare, Share2 } from "lucide-react";
import { useToggleJournalEntryLike } from "../../../hooks/useEntries";
import { useCallback } from "react";

const ActionsBar = ({
  journal,
  user,
  setShowShareModal,
  setShowComments,
  comments,
  showComments,
  refetchJournal,
}: any) => {
  const listId =
    journal &&
    typeof journal.destination === "object" &&
    journal.destination !== null &&
    "list" in journal.destination
      ? (journal.destination as any).list?._id
      : undefined;

  const likes: string[] = journal.likes || [];
  const hasLiked = user ? likes.includes(user.id) : false;

  const toggleLike = useToggleJournalEntryLike(listId);

  const handleLike = () => {
    if (!user || toggleLike.isPending) return;
    toggleLike.mutate(journal.id, {
      onSuccess: () => {
        if (typeof refetchJournal === "function") {
          refetchJournal();
        }
      },
    });
  };

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
  }, [journal, setShowShareModal]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
          user && hasLiked
            ? "text-red-500 bg-red-50"
            : "text-gray-500 hover:text-red-500 hover:bg-red-50"
        }`}
        disabled={toggleLike.isPending || !user}
      >
        <Heart
          size={18}
          className={`transition-all duration-200 ${
            user && hasLiked ? "fill-current" : ""
          }`}
        />
        <span className="text-sm font-medium">
          {likes.length} Like{likes.length !== 1 ? "s" : ""}
        </span>
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
  );
};

export default ActionsBar;

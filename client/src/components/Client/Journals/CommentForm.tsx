import { Image, Send, Smile } from "lucide-react";
import { useCommentForm, useCreateComment } from "../../../hooks/useComments";
import { useCallback } from "react";

type Props = {
  user: any;
  journalId: string;
};

const CommentForm = ({ user, journalId }: Props) => {
  const commentForm = useCommentForm();
  const createComment = useCreateComment();

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

  return (
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
              disabled={!commentForm.isValid || commentForm.isSubmitting}
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
  );
};

export default CommentForm;

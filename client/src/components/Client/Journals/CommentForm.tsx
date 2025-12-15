import { Image, Send, Smile, Trash2 } from "lucide-react";
import { useCommentForm, useCreateComment } from "../../../hooks/useComments";
import { useCallback, useState, useRef } from "react";

type Props = {
  user: any;
  journalId: string;
};

const CommentForm = ({ user, journalId }: Props) => {
  const commentForm = useCommentForm();
  const createComment = useCreateComment();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showStickers, setShowStickers] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common stickers/emojis
  const stickers = [
    "❤️",
    "👍",
    "😍",
    "🔥",
    "✈️",
    "🌎",
    "📸",
    "🎉",
    "🌟",
    "💯",
    "🤩",
    "😊",
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 3 images for comments
    const remainingSlots = 3 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setSelectedImages((prev) => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSticker = (sticker: string) => {
    commentForm.setContent((prev) => prev + sticker);
    setShowStickers(false);
  };

  const handleSubmitComment = useCallback(async () => {
    if (!commentForm.isValid || !journalId) return;
    commentForm.setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", commentForm.content);
      formData.append("journalEntry", journalId);

      // Append images if any
      selectedImages.forEach((image) => {
        formData.append("photos", image);
      });

      await createComment.mutateAsync(formData as any);
      commentForm.reset();
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      commentForm.setIsSubmitting(false);
    }
  }, [commentForm, createComment, journalId, selectedImages]);

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

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 3}
                className={`p-2 rounded-full transition-all duration-200 ${
                  selectedImages.length >= 3
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-indigo-500 hover:bg-indigo-50"
                }`}
              >
                <Image size={18} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStickers(!showStickers)}
                  className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-200"
                >
                  <Smile size={18} />
                </button>

                {showStickers && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 z-10">
                    {stickers.map((sticker, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addSticker(sticker)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-lg"
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {commentForm.content.length}/500
              </span>
              {selectedImages.length > 0 && (
                <span className="text-xs text-indigo-500">
                  ({selectedImages.length}/3 images)
                </span>
              )}
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

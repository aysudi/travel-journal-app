import { ExternalLink } from "lucide-react";
import { useCallback } from "react";

const ShareModal = ({ setShowShareModal }: any) => {
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, []);

  return (
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
  );
};

export default ShareModal;

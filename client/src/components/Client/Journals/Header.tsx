import { ArrowLeft, Globe, Lock, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  user: any;
  journal: any;
};

const Header = ({ user, journal }: Props) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Header;

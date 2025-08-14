import { Heart, MessageSquare, MoreVertical, Share2 } from "lucide-react";
import { Link } from "react-router";
import { useUserProfile } from "../../../hooks/useAuth";
import { useToggleJournalEntryLike } from "../../../hooks/useEntries";
import Loading from "../../Common/Loading";

type Props = {
  listId: string | undefined;
  journal: any;
};

const ActionButtons = ({ listId, journal }: Props) => {
  const toggleJournalEntryLike = useToggleJournalEntryLike(listId);
  const { data: user, isLoading: isLoadingUser } = useUserProfile();

  if (isLoadingUser) {
    return <Loading variant="page" />;
  }

  return (
    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 transition-all duration-200 px-3 py-2 rounded-lg font-medium bg-gray-100 hover:bg-red-100 hover:text-red-600 cursor-pointer"
          onClick={() =>
            user &&
            !toggleJournalEntryLike.isPending &&
            toggleJournalEntryLike.mutate(journal.id) &&
            console.log(user)
          }
          disabled={toggleJournalEntryLike.isPending || !user}
        >
          <Heart
            size={18}
            className={`transition-transform duration-200 ${
              user && journal.likes?.find((like: any) => like._id === user.id)
                ? "text-red-500 scale-110"
                : "text-gray-400 group-hover:text-red-500 group-hover:scale-110"
            }`}
            fill={
              user && journal.likes?.find((like: any) => like._id === user.id)
                ? "#ef4444"
                : "none"
            }
          />
          <span>
            {user && journal.likes?.find((like: any) => like._id === user.id)
              ? "Liked"
              : "Like"}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-200 ${
              user && journal.likes?.find((like: any) => like._id === user.id)
                ? "text-red-500"
                : "text-gray-500 group-hover:text-red-500"
            }`}
          >
            {journal.likes?.length || 0}
          </span>
        </button>

        <Link
          to={`/journals/${journal.id}`}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-all duration-200"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
            <MessageSquare
              size={18}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <span className="text-sm font-medium">Comment</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors duration-200">
            {journal.comments?.length || 0}
          </span>
        </Link>

        <button className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all duration-200 cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors duration-200">
            <Share2
              size={18}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Additional actions menu */}
      <div className="relative">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;

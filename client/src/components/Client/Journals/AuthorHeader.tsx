import { Clock } from "lucide-react";
import { Link } from "react-router";
import formatTimeAgo from "../../../utils/formatTimeAgo";

const AuthorHeader = ({ journal }: { journal: any }) => {
  return (
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
  );
};

export default AuthorHeader;

import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import type { UserProfile } from "../../../services";

type RecentStoriesProps = {
  user: UserProfile;
  recentJournals: any[];
  journalsLoading: boolean;
};

const RecentStories = ({
  user,
  recentJournals,
  journalsLoading,
}: RecentStoriesProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            My Recent Journal Entries
          </h2>
          <Link
            to="/journals"
            className="text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded-md transition-all duration-200"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="p-6">
        {journalsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentJournals && recentJournals.length > 0 ? (
          <div className="space-y-4">
            {recentJournals.slice(0, 4).map((journal: any, ind: number) => (
              <Link
                to={`/journals/${journal.id}`}
                key={ind}
                className="p-4 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user?.fullName?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 group-hover:text-green-600 transition-colors truncate">
                      {journal.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                      {journal.content}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-slate-400">
                        {journal.createdAt
                          ? formatDate(journal.createdAt)
                          : "Recently"}
                      </span>
                      {journal.photos && journal.photos.length > 0 && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">
                            {journal.photos.length} photo
                            {journal.photos.length !== 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No journal entries yet</p>
            <p className="text-slate-400 text-xs mt-1">
              Start documenting your travel adventures!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentStories;

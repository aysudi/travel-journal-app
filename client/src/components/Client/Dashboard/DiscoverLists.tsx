import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicTravelLists } from "../../../hooks/useTravelList";

const DiscoverLists = () => {
  const { data: publicListsData, isLoading: publicLoading } =
    usePublicTravelLists({ limit: 3 });

  const publicLists = publicListsData || [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Discover Lists
          </h2>
          <Link
            to="/explore"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition-all duration-200"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="p-6">
        {publicLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : publicLists.length > 0 ? (
          <div className="space-y-4">
            {publicLists.map((list: any, ind: number) => (
              <Link
                key={ind}
                to={`/lists/${list.id}`}
                className="block p-4 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {list.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {list.description && list.description.length > 80
                        ? `${list.description.substring(0, 80)}...`
                        : list.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-slate-400">
                        by {list.owner?.fullName || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">
                        {list.destinations?.length || 0} destinations
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No public lists available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverLists;

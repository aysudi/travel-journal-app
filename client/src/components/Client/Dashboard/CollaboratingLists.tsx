import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const CollaboratingLists = ({
  collaboratingLists,
}: {
  collaboratingLists: any[];
}) => {
  return (
    <div
      id="collaborating"
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20"
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Lists I'm Collaborating On
          </h2>
          <span className="text-sm text-slate-500">
            {collaboratingLists.length} list
            {collaboratingLists.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {collaboratingLists.slice(0, 3).map((list: any, ind: number) => (
            <Link
              key={ind}
              to={`/lists/${list._id}`}
              className="block p-4 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                      {list.title}
                    </h3>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                      Invited
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {list.description && list.description.length > 80
                      ? `${list.description.substring(0, 80)}...`
                      : list.description || "No description"}
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
      </div>
    </div>
  );
};

export default CollaboratingLists;

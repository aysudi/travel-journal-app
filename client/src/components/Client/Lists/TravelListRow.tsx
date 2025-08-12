import { Link } from "react-router-dom";
import type { TravelList } from "../../../services";
import formatDate from "../../../utils/formatDate";
import {
  MapPin,
  Calendar,
  Globe,
  Lock,
  MoreVertical,
  UserCheck,
} from "lucide-react";

const TravelListRow: React.FC<{ list: TravelList }> = ({ list }) => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center gap-6">
      {/* Thumbnail */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
        {list.coverImage ? (
          <img
            src={list.coverImage}
            alt={list.title}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <MapPin className="w-8 h-8 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {list.title}
          </h3>
          <div className="flex items-center gap-2 ml-4">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                list.visibility === "public"
                  ? "bg-green-100 text-green-700"
                  : list.visibility === "friends"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {list.visibility === "public" ? (
                <Globe size={12} />
              ) : list.visibility === "friends" ? (
                <UserCheck size={12} />
              ) : (
                <Lock size={12} />
              )}
              {list.visibility === "public"
                ? "Public"
                : list.visibility === "friends"
                ? "Friends"
                : "Private"}
            </div>
          </div>
        </div>

        {list.description && (
          <p className="text-slate-600 text-sm mb-3 line-clamp-1">
            {list.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{list.destinations.length} destinations</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Updated {formatDate(list.updatedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/lists/${list.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              View
            </Link>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TravelListRow;

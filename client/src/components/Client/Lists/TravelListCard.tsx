import type { TravelList } from "../../../services";
import {
  MapPin,
  Users,
  Calendar,
  Globe,
  Lock,
  Share2,
  MoreVertical,
  Eye,
  UserCheck,
} from "lucide-react";
import formatDate from "../../../utils/formatDate";
import { Link } from "react-router";

const TravelListCard: React.FC<{ list: TravelList }> = ({ list }) => (
  <Link
    to={`/lists/${list.id || list?._id}`}
    className="group bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
  >
    {/* Cover Image */}
    <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      {list.coverImage ? (
        <img
          src={list.coverImage}
          alt={list.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white/80" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>

      {/* Privacy Badge */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            list.visibility === "public"
              ? "bg-green-500 text-white"
              : list.visibility === "friends"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-white"
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

    {/* Content */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {list.title}
        </h3>
        <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} className="text-slate-500" />
        </button>
      </div>

      {list.description && (
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {list.description}
        </p>
      )}

      {/* Tags */}
      {list.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {list.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
          {list.tags.length > 3 && (
            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md font-medium">
              +{list.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{list.destinations.length} destinations</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{list.customPermissions.length + 1}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(list.updatedAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Eye size={16} />
          View List
        </button>
        <button className="p-2 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer">
          <Share2 size={16} className="text-slate-600" />
        </button>
      </div>
    </div>
  </Link>
);

export default TravelListCard;

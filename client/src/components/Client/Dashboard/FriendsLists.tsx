import { Link } from "react-router";
import { Users, MapPin, Calendar, User } from "lucide-react";
import type { TravelList } from "../../../types/api";
import formatDate from "../../../utils/formatDate";

interface FriendsListsProps {
  friendsLists: TravelList[] | undefined;
  isLoading?: boolean;
}

const FriendsLists = ({ friendsLists, isLoading }: FriendsListsProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="text-pink-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Friends Only Lists
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!friendsLists || friendsLists.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="text-pink-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Friends Only Lists
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No friends-only lists yet
            </h3>
            <p className="text-gray-500">
              When your friends create lists with "friends" visibility, they'll
              appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="text-pink-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Friends Only Lists
            </h2>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              {friendsLists.length}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {friendsLists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.id}`}
              className="block group hover:bg-gray-50 rounded-lg p-4 transition-colors duration-200 border border-transparent hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                {/* Cover Image */}
                <div className="flex-shrink-0">
                  {list.coverImage ? (
                    <img
                      src={list.coverImage}
                      alt={list.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <MapPin className="text-white" size={20} />
                    </div>
                  )}
                </div>

                {/* List Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 truncate flex items-center gap-2">
                        {list.title}
                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                          Friends Only
                        </span>
                      </h3>

                      {/* Owner Info */}
                      <div className="flex items-center space-x-2 mt-1">
                        {typeof list.owner === "object" &&
                        list.owner?.profileImage ? (
                          <img
                            src={list.owner.profileImage}
                            alt={list.owner.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                            <User className="text-white" size={12} />
                          </div>
                        )}
                        <span className="text-sm text-gray-600 truncate">
                          by{" "}
                          {typeof list.owner === "object"
                            ? list.owner?.fullName
                            : "Unknown"}
                        </span>
                      </div>

                      {/* Description */}
                      {list.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {list.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>
                            {list.destinations?.length || 0} destinations
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{formatDate(list.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Link */}
        {friendsLists.length >= 5 && (
          <div className="mt-6 text-center">
            <Link
              to="/lists?filter=friends"
              className="text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors duration-200"
            >
              View all friends-only lists →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsLists;

import { Crown, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import {
  useSearchUsers,
  useSendFriendRequest,
} from "../../../hooks/useFriends";

const AddFriend = ({
  setShowAddFriend,
}: {
  setShowAddFriend: (show: boolean) => void;
}) => {
  const sendFriendRequest = useSendFriendRequest();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults } = useSearchUsers(searchQuery);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Friend
          </h2>
          <button
            onClick={() => setShowAddFriend(false)}
            className="text-gray-400 hover:text-gray-600 p-2 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {searchResults?.map((user) => (
            <div
              key={user.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      {user.fullName}
                      {user.isVerified && (
                        <Crown size={14} className="text-blue-500" />
                      )}
                      {user.profileVisibility === "private" && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                          Private
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
                <div>
                  {user.isFriend ? (
                    <span className="text-sm text-green-600 font-medium">
                      Friends
                    </span>
                  ) : user.hasRequestPending ? (
                    <span className="text-sm text-yellow-600 font-medium">
                      Pending
                    </span>
                  ) : user.hasReceivedRequest ? (
                    <span className="text-sm text-blue-600 font-medium">
                      Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest.mutate(user.id)}
                      disabled={sendFriendRequest.isPending}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      <UserPlus size={16} />
                      <span>
                        {user.profileVisibility === "public"
                          ? "Add Friend"
                          : "Send Request"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery.trim().length >= 2 &&
          (!searchResults || searchResults.length === 0) && (
            <div className="text-center py-8">
              <Search size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching with a different username or email
              </p>
            </div>
          )}

        {/* Search prompt */}
        {searchQuery.trim().length < 2 && (
          <div className="text-center py-8">
            <Search size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Start typing to search for users</p>
            <p className="text-sm text-gray-400 mt-1">
              Enter at least 2 characters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriend;

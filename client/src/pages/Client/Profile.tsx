import { useState } from "react";
import {
  Calendar,
  Crown,
  Users,
  UserPlus,
  Search,
  X,
  Check,
  UserMinus,
} from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useFriends,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useRemoveFriend,
  useSearchUsers,
} from "../../hooks/useFriends";
import ChangePassword from "../../components/Client/Profile/ChangePassword";
import UserInfo from "../../components/Client/Profile/UserInfo";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import TravelStatistics from "../../components/Client/Profile/TravelStatistics";
import ProfileImage from "../../components/Client/Profile/ProfileImage";
import ActionsButtons from "../../components/Client/Profile/ActionsButtons";

const Profile = () => {
  const { data: user, isLoading, isError, error } = useUserProfile();
  const { data: friendsData } = useFriends();
  const sendFriendRequest = useSendFriendRequest();
  const acceptFriendRequest = useAcceptFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();
  const removeFriend = useRemoveFriend();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults } = useSearchUsers(searchQuery);

  const [editData, setEditData] = useState<{
    fullName: string;
    username: string;
    profileVisibility: "public" | "private";
    profileImage: string | File;
  }>({
    fullName: "",
    username: "",
    profileVisibility: "public" as "public" | "private",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const friends = friendsData?.friends || [];
  const friendRequests = friendsData?.friendRequestsReceived || [];

  if (isLoading) {
    return <Loading variant="page" />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>
              Error loading profile: {error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 relative">
            {/* Premium Badge */}
            {user.premium && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Crown size={16} />
                  Premium
                </div>
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="relative px-8 pb-8">
            {/* Profile Image */}
            <ProfileImage
              setImagePreview={setImagePreview}
              isEditing={isEditing}
              setEditData={setEditData}
              imagePreview={imagePreview}
              user={user}
            />

            {/* Profile Header with Action Buttons */}
            <div className="pt-20 pb-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {user.fullName}
                  </h2>
                  <p className="text-lg text-gray-600">@{user.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={16} />
                      Joined {formatDate(user.createdAt)}
                    </div>
                    {user.isVerified && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <ActionsButtons
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  editData={editData}
                  setEditData={setEditData}
                  setImagePreview={setImagePreview}
                  user={user}
                />
              </div>
            </div>

            {/* User Info */}
            <UserInfo
              user={user}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
              setShowChangePassword={setShowChangePassword}
            />
          </div>
        </div>

        {/* Travel Statistics */}
        <TravelStatistics user={user} />

        {/* Friends Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-800">Friends</h3>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {friends.length}
              </span>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <UserPlus size={18} />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Friend Requests ({friendRequests.length})
              </h4>
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <div
                    key={request.from.id}
                    className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {request.from.profileImage ? (
                        <img
                          src={request.from.profileImage}
                          alt={request.from.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {request.from.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {request.from.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          @{request.from.username}
                        </p>
                        {request.from.isVerified && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Crown size={12} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          acceptFriendRequest.mutate(request.from.id)
                        }
                        disabled={acceptFriendRequest.isPending}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        <Check size={16} />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() =>
                          rejectFriendRequest.mutate(request.from.id)
                        }
                        disabled={rejectFriendRequest.isPending}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        <X size={16} />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              My Friends
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      {friend.profileImage ? (
                        <img
                          src={friend.profileImage}
                          alt={friend.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {friend.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {friend.fullName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        @{friend.username}
                      </p>
                      {friend.isVerified && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Crown size={12} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span></span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => removeFriend.mutate(friend.id)}
                        disabled={removeFriend.isPending}
                        className="text-red-500 hover:text-red-600 p-1 disabled:opacity-50 cursor-pointer"
                        title="Remove friend"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {friends.length === 0 && (
              <div className="text-center py-12">
                <Users size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No friends yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start connecting with other travelers and build your network
                </p>
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <UserPlus size={20} />
                  <span>Find Friends</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Friend Modal */}
        {showAddFriend && (
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
                          <p className="text-sm text-gray-600">
                            @{user.username}
                          </p>
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
                  <p className="text-gray-500">
                    Start typing to search for users
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Enter at least 2 characters
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <ChangePassword setShowChangePassword={setShowChangePassword} />
        )}
      </div>
    </div>
  );
};

export default Profile;

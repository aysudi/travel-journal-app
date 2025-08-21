import { Crown, UserMinus, UserPlus, Users } from "lucide-react";
import { useRemoveFriend } from "../../../hooks/useFriends";
import Swal from "sweetalert2";

type FriendsProps = {
  friends: Array<{
    id: string;
    fullName: string;
    username: string;
    profileImage: string | null;
    isVerified: boolean;
  }>;
  setShowAddFriend: (show: boolean) => void;
};

const FriendsList = ({ friends, setShowAddFriend }: FriendsProps) => {
  const removeFriend = useRemoveFriend();

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">My Friends</h4>
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
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        removeFriend.mutate(friend.id);
                        Swal.fire({
                          title: "Deleted!",
                          text: "Your friend has been deleted.",
                          icon: "success",
                        });
                      }
                    });
                  }}
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
  );
};

export default FriendsList;

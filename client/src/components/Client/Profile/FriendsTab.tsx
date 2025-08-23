import { UserPlus, Users } from "lucide-react";
import FriendsRequests from "./FriendsRequests";
import FriendsList from "./FriendsList";

const FriendsTab = ({ friends, friendsData, setShowAddFriend }: any) => {
  const friendRequests = friendsData?.friendRequestsReceived || [];

  return (
    <div>
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
          <FriendsRequests friendRequests={friendRequests} />
        )}

        {/* Friends List */}
        <FriendsList friends={friends} setShowAddFriend={setShowAddFriend} />
      </div>
    </div>
  );
};

export default FriendsTab;

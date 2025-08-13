import { Check, Crown, X } from "lucide-react";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
} from "../../../hooks/useFriends";

const FriendsRequests = ({ friendRequests }: { friendRequests: any[] }) => {
  const acceptFriendRequest = useAcceptFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();

  return (
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
                onClick={() => acceptFriendRequest.mutate(request.from.id)}
                disabled={acceptFriendRequest.isPending}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              >
                <Check size={16} />
                <span>Accept</span>
              </button>
              <button
                onClick={() => rejectFriendRequest.mutate(request.from.id)}
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
  );
};

export default FriendsRequests;

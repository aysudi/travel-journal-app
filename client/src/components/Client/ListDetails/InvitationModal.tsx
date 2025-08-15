import { Crown, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useSearchUsers } from "../../../hooks/useFriends";
import { useCreateListInvitation } from "../../../hooks/useListInvitations";
import { useUserProfile } from "../../../hooks/useAuth";
import Loading from "../../Common/Loading";
import Swal from "sweetalert2";

type Props = {
  setShowInviteModal: (show: boolean) => void;
  list: any;
};

const InvitationModal = ({ setShowInviteModal, list }: Props) => {
  const createListInvitation = useCreateListInvitation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: userProfile, isLoading } = useUserProfile();

  const { data: searchResults } = useSearchUsers(searchQuery);

  if (!userProfile && isLoading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Friend
          </h2>
          <button
            onClick={() => setShowInviteModal(false)}
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
                  <button
                    onClick={async () => {
                      Swal.fire({
                        title: "Invitation Sent!",
                        icon: "success",
                        draggable: true,
                      });

                      setShowInviteModal(false);

                      await createListInvitation.mutateAsync({
                        list: list._id,
                        inviter: userProfile?.id,
                        invitee: user.id,
                        permissionLevel: "co-owner",
                      });
                    }}
                    disabled={createListInvitation.isPending}
                    className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <UserPlus size={16} />
                    <span>Collaborate</span>
                  </button>
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

export default InvitationModal;

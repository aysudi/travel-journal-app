import { useState } from "react";
import { Calendar, Crown, Users, UserPlus } from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import { useFriends } from "../../hooks/useFriends";
import ChangePassword from "../../components/Client/Profile/ChangePassword";
import UserInfo from "../../components/Client/Profile/UserInfo";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import TravelStatistics from "../../components/Client/Profile/TravelStatistics";
import ProfileImage from "../../components/Client/Profile/ProfileImage";
import ActionsButtons from "../../components/Client/Profile/ActionsButtons";
import AddFriend from "../../components/Client/Profile/AddFriend";
import FriendsRequests from "../../components/Client/Profile/FriendsRequests";
import FriendsList from "../../components/Client/Profile/FriendsList";

const Profile = () => {
  const { data: user, isLoading, isError, error } = useUserProfile();
  const { data: friendsData } = useFriends();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

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

  const handleGoPremium = async () => {
    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems: [
            {
              price: import.meta.env.VITE_STRIPE_PRODUCT_ID,
              quantity: 1,
            },
          ],
          successUrl: window.location.origin + "/profile/success",
          cancelUrl: window.location.origin + "/profile",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not start checkout. Please try again.");
      }
    } catch (err) {
      alert("Failed to start premium checkout. Please try again.");
    }
  };

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
            <div className="absolute top-4 right-4">
              {user.premium ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-base cursor-pointer">
                  <Crown size={20} className="animate-bounce" />
                  <span>You're a Premium Member</span>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <button
                    onClick={handleGoPremium}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-2 rounded-xl shadow-lg font-semibold text-base hover:scale-105 hover:from-teal-600 hover:to-cyan-700 transition-all duration-200 cursor-pointer"
                  >
                    <Crown size={20} />
                    <span>Upgrade to Premium</span>
                  </button>
                  <span className="mt-2 text-xs text-cyan-900 bg-cyan-100 px-2 py-1 rounded">
                    Unlock exclusive features!
                  </span>
                </div>
              )}
            </div>
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
            <FriendsRequests friendRequests={friendRequests} />
          )}

          {/* Friends List */}
          <FriendsList friends={friends} setShowAddFriend={setShowAddFriend} />
        </div>

        {/* Add Friend Modal */}
        {showAddFriend && <AddFriend setShowAddFriend={setShowAddFriend} />}

        {/* Change Password Modal */}
        {showChangePassword && (
          <ChangePassword setShowChangePassword={setShowChangePassword} />
        )}
      </div>
    </div>
  );
};

export default Profile;

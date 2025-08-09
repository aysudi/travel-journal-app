import { useState } from "react";
import { Calendar, Crown } from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import ChangePassword from "../../components/Client/Profile/ChangePassword";
import UserInfo from "../../components/Client/Profile/UserInfo";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import TravelStatistics from "../../components/Client/Profile/TravelStatistics";
import ProfileImage from "../../components/Client/Profile/ProfileImage";
import ActionsButtons from "../../components/Client/Profile/ActionsButtons";

const Profile = () => {
  const { data: user, isLoading, isError, error } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
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

        {/* Change Password Modal */}
        {showChangePassword && (
          <ChangePassword setShowChangePassword={setShowChangePassword} />
        )}
      </div>
    </div>
  );
};

export default Profile;

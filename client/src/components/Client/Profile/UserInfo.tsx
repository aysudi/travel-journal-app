import {
  User,
  Mail,
  Edit3,
  Shield,
  Calendar,
  Settings,
  Globe,
  Lock,
} from "lucide-react";
import formatDate from "../../../utils/formatDate";
import type { UserProfile } from "../../../services";

type UserInfoProps = {
  user: UserProfile;
  isEditing: boolean;
  editData: any;
  setEditData: (data: any) => void;
  setShowChangePassword: (show: boolean) => void;
};

const UserInfo = ({
  user,
  isEditing,
  editData,
  setEditData,
  setShowChangePassword,
}: UserInfoProps) => {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🔍";
      case "github":
        return "🐙";
      default:
        return "🔒";
    }
  };

  return (
    <div className="pt-6">
      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Edit3 size={20} />
            <span className="font-medium">Edit Mode</span>
          </div>
          <p className="text-blue-600 text-sm mt-1">
            Make your changes and click "Save Changes" when done.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User size={24} />
            Basic Information
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData((prev: any) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                {user.fullName}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={(e) =>
                  setEditData((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                placeholder="Enter your username"
              />
            ) : (
              <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                @{user.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
              {isEditing && (
                <span className="text-xs text-gray-500 ml-2">
                  (Cannot be changed)
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-gray-400" />
              <p
                className={`text-lg text-gray-800 px-4 py-3 rounded-lg flex-1 ${
                  isEditing
                    ? "bg-gray-100 border border-gray-200"
                    : "bg-gray-50"
                }`}
              >
                {user.email}
              </p>
              {user.isVerified && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Profile Visibility
            </label>
            {isEditing ? (
              <select
                name="profileVisibility"
                value={editData.profileVisibility}
                onChange={(e) =>
                  setEditData((prev: any) => ({
                    ...prev,
                    profileVisibility: e.target.value as "public" | "private",
                  }))
                }
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
              >
                <option value="public">
                  🌍 Public - Anyone can see your profile
                </option>
                <option value="private">
                  🔒 Private - Only you can see your profile
                </option>
              </select>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
                {user.profileVisibility === "public" ? (
                  <Globe size={20} className="text-green-500" />
                ) : (
                  <Lock size={20} className="text-gray-500" />
                )}
                <span className="text-lg text-gray-800 capitalize">
                  {user.profileVisibility}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings size={24} />
            Account Details
          </h2>

          {/* Account Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Account Provider
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
              <span className="text-2xl">{getProviderIcon(user.provider)}</span>
              <span className="text-lg text-gray-800 capitalize">
                {user.provider}
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
              <Shield size={20} className="text-blue-500" />
              <span className="text-lg text-gray-800">{user.status}</span>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Member Since
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
              <Calendar size={20} className="text-gray-400" />
              <span className="text-lg text-gray-800">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          {/* Last Login */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Last Login
            </label>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
              <Calendar size={20} className="text-gray-400" />
              <span className="text-lg text-gray-800">
                {formatDate(user.lastLogin)}
              </span>
            </div>
          </div>

          {/* Change Password Button (only for local accounts) */}
          {user.provider === "local" && !isEditing && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Change Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

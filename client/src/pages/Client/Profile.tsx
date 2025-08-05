import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Calendar,
  Crown,
  MapPin,
  Users,
  BookOpen,
  Settings,
  Globe,
  Lock,
} from "lucide-react";

interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  provider: "local" | "google" | "github";
  status: "Viewer" | "Editor" | "Owner";
  premium: boolean;
  profileVisibility: "public" | "private";
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  ownedLists: any[];
  collaboratingLists: any[];
  journalEntries?: any[];
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile>({
    _id: "1",
    fullName: "Sarah Johnson",
    username: "sarahj_travels",
    email: "sarah.johnson@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    provider: "local",
    status: "Editor",
    premium: true,
    profileVisibility: "public",
    isVerified: true,
    lastLogin: "2025-08-06T10:30:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    ownedLists: Array(5).fill({}),
    collaboratingLists: Array(3).fill({}),
    journalEntries: Array(12).fill({}),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isEditing) {
          setEditedUser({ ...editedUser, profileImage: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    // TODO: API call to change password
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            <div className="absolute -top-16 left-8">
              <div className="relative">
                <img
                  src={isEditing ? editedUser.profileImage : user.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

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
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
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
                        value={editedUser.fullName}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            fullName: e.target.value,
                          })
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
                        value={editedUser.username}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            username: e.target.value,
                          })
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
                        value={editedUser.profileVisibility}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            profileVisibility: e.target.value as
                              | "public"
                              | "private",
                          })
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
                      <span className="text-2xl">
                        {getProviderIcon(user.provider)}
                      </span>
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
                      <span className="text-lg text-gray-800">
                        {user.status}
                      </span>
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
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Change Password
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {user.ownedLists.length}
            </h3>
            <p className="text-gray-600">Travel Lists Owned</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {user.collaboratingLists.length}
            </h3>
            <p className="text-gray-600">Collaborating Lists</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {user.journalEntries?.length || 0}
            </h3>
            <p className="text-gray-600">Journal Entries</p>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Change Password
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

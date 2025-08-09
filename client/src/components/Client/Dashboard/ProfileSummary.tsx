import { Globe, Lock, User } from "lucide-react";
import formatDate from "../../../utils/formatDate";
import { Link } from "react-router-dom";

const ProfileSummary = ({ user }: any) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">
          Profile Summary
        </h2>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img
              src={user?.profileImage}
              alt={user?.fullName}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-lg"
            />
            {user?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{user?.fullName}</h3>
            <p className="text-sm text-slate-500">@{user?.username}</p>
            <div className="flex items-center space-x-2 mt-1">
              {user?.profileVisibility === "public" ? (
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Globe size={10} />
                  <span>Public</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Lock size={10} />
                  <span>Private</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
            <span className="text-slate-600 font-medium">Member since</span>
            <span className="text-slate-900 font-semibold">
              {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
            <span className="text-slate-600 font-medium">Account type</span>
            <span className="text-slate-900 font-semibold capitalize flex items-center space-x-1">
              {user?.provider === "local" ? (
                <span>🔒 Email</span>
              ) : user?.provider === "google" ? (
                <span>🔍 Google</span>
              ) : user?.provider === "github" ? (
                <span>🐙 GitHub</span>
              ) : (
                <span className="capitalize">{user?.provider}</span>
              )}
            </span>
          </div>
        </div>

        <Link
          to="/profile"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:shadow-md hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <User
            size={14}
            className="group-hover:scale-110 transition-transform duration-200"
          />
          <span>View Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileSummary;

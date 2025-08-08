import { Link } from "react-router";
import {
  MapPin,
  Plus,
  Users,
  BookOpen,
  Crown,
  Globe,
  Lock,
  User,
  BarChart3,
} from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useOwnedTravelLists,
  useCollaboratingTravelLists,
  usePublicTravelLists,
} from "../../hooks/useTravelList";
import formatDate from "../../utils/formatDate";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: ownedLists } = useOwnedTravelLists();
  const { data: collaboratingLists } = useCollaboratingTravelLists();
  const { data: publicListsData, isLoading: publicLoading } =
    usePublicTravelLists({ limit: 3 });

  const publicLists = publicListsData || [];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: "My Lists",
      value: ownedLists?.length || 0,
      icon: MapPin,
      color: "from-blue-500 to-blue-600",
      href: "/my-lists",
    },
    {
      name: "Collaborating",
      value: collaboratingLists?.length || 0,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      href: "/lists",
    },
    {
      name: "Journal Entries",
      value: 0,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      href: "/journal",
    },
    {
      name: "All Lists Access",
      value: (ownedLists?.length || 0) + (collaboratingLists?.length || 0),
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      href: "/lists",
    },
  ];

  const recentActivity = [
    ...(ownedLists || []).slice(0, 3).map((list: any) => ({
      id: `owned-${list._id}`,
      listId: list._id,
      type: "owned",
      title: list.title,
      description: `Created ${formatDate(list.createdAt)}`,
      icon: MapPin,
      href: `/lists/${list._id}`,
    })),
    ...(collaboratingLists || []).slice(0, 2).map((list: any) => ({
      id: `collab-${list._id}`,
      listId: list._id,
      type: "collaboration",
      title: list.title,
      description: `Collaborating with ${list.owner?.fullName || "others"}`,
      icon: Users,
      href: `/lists/${list._id}`,
    })),
  ]
    .filter(
      (activity, index, arr) =>
        arr.findIndex((item) => item.listId === activity.listId) === index
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.fullName || "Explorer"}!
              </h1>
              <p className="text-slate-600 mt-2">
                {user?.lastLogin
                  ? `Last login: ${formatDate(user.lastLogin)}`
                  : "Ready to explore the world?"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.premium && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-xl font-medium">
                  <Crown size={16} />
                  <span>Premium</span>
                </div>
              )}
              <Link
                to="/my-lists"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create List</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                to={stat.href}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Recent Activity
                  </h2>
                  <Link
                    to="/my-lists"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <Link
                          key={activity.id}
                          to={activity.href}
                          className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              activity.type === "owned"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {activity.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No recent activity</p>
                    <Link
                      to="/my-lists"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                    >
                      Create your first travel list
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Summary & Public Lists */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">
                  Profile Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={user?.profileImage}
                    alt={user?.fullName}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {user?.fullName}
                    </h3>
                    <p className="text-sm text-slate-500">@{user?.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {user?.profileVisibility === "public" ? (
                        <Globe size={12} className="text-green-500" />
                      ) : (
                        <Lock size={12} className="text-slate-400" />
                      )}
                      <span className="text-xs text-slate-500 capitalize">
                        {user?.profileVisibility}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Member since</span>
                    <span className="font-medium text-slate-900">
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Account Type</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {user?.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Provider</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {user?.provider}
                    </span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="w-full mt-6 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <User size={16} />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Featured Public Lists */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Discover Lists
                  </h2>
                  <Link
                    to="/lists"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {publicLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : publicLists.length > 0 ? (
                  <div className="space-y-4">
                    {publicLists.map((list: any, ind: number) => (
                      <Link
                        key={ind}
                        to={`/lists/${list.id}`}
                        className="block p-4 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                              {list.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {list.description && list.description.length > 80
                                ? `${list.description.substring(0, 80)}...`
                                : list.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-slate-400">
                                by {list.owner?.fullName || "Unknown"}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-400">
                                {list.destinations?.length || 0} destinations
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                      No public lists available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

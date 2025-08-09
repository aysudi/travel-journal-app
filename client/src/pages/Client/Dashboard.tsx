import { Link } from "react-router";
import {
  MapPin,
  Plus,
  Users,
  BookOpen,
  Crown,
  Globe,
  BarChart3,
} from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useOwnedTravelLists,
  useCollaboratingTravelLists,
  usePublicTravelLists,
} from "../../hooks/useTravelList";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import ProfileSummary from "../../components/Client/Dashboard/ProfileSummary";
import RecentActivity from "../../components/Client/Dashboard/RecentActivity";
import StatsGrid from "../../components/Client/Dashboard/StatsGrid";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: ownedLists } = useOwnedTravelLists();
  const { data: collaboratingLists } = useCollaboratingTravelLists();
  const { data: publicListsData, isLoading: publicLoading } =
    usePublicTravelLists({ limit: 3 });

  const publicLists = publicListsData || [];

  if (userLoading) {
    return <Loading variant="page" />;
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
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <RecentActivity
            ownedLists={ownedLists}
            collaboratingLists={collaboratingLists}
          />

          {/* Profile Summary & Public Lists */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <ProfileSummary user={user} />

            {/* Featured Public Lists */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Discover Lists
                  </h2>
                  <Link
                    to="/lists"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition-all duration-200"
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

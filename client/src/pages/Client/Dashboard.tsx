import { Link } from "react-router";
import { MapPin, Plus, Users, BookOpen, Crown, BarChart3 } from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useOwnedTravelLists,
  useCollaboratingTravelLists,
  useFriendsTravelLists,
} from "../../hooks/useTravelList";
import { useJournalEntriesByAuthor } from "../../hooks/useEntries";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import ProfileSummary from "../../components/Client/Dashboard/ProfileSummary";
import RecentActivity from "../../components/Client/Dashboard/RecentActivity";
import StatsGrid from "../../components/Client/Dashboard/StatsGrid";
import { usePendingReceivedInvitations } from "../../hooks/useListInvitations";
import RecentStories from "../../components/Client/Dashboard/RecentStories";
import DiscoverLists from "../../components/Client/Dashboard/DiscoverLists";
import CollaboratingLists from "../../components/Client/Dashboard/CollaboratingLists";
import PendingInvitations from "../../components/Client/Dashboard/PendingInvitations";
import FriendsLists from "../../components/Client/Dashboard/FriendsLists";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: ownedLists } = useOwnedTravelLists();
  const { data: collaboratingLists } = useCollaboratingTravelLists();
  const { data: friendsLists, isLoading: friendsListsLoading } =
    useFriendsTravelLists(5); // Show 5 friends' lists

  const { data: recentJournalsData, isLoading: journalsLoading } =
    useJournalEntriesByAuthor(user?.id || "");

  const { data: pendingInvitations } = usePendingReceivedInvitations(
    user?.id || ""
  );

  const recentJournals = (recentJournalsData as any) || [];

  if (userLoading) {
    return <Loading variant="page" />;
  }

  if (!user?.id) {
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
      href: "#collaborating",
    },
    {
      name: "Journal Entries",
      value: recentJournals?.length || 0,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      href: "/journals",
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
                to="/create-list"
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
          {/* Left Column - Activity & Collaborations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <RecentActivity
              ownedLists={ownedLists}
              collaboratingLists={collaboratingLists}
            />

            {/* Lists I'm Collaborating On */}
            {collaboratingLists && collaboratingLists.length > 0 && (
              <CollaboratingLists collaboratingLists={collaboratingLists} />
            )}

            {/* Pending List Invitations */}
            {pendingInvitations && pendingInvitations.length > 0 && (
              <PendingInvitations pendingInvitations={pendingInvitations} />
            )}

            {/* Friends Only Lists */}
            <FriendsLists
              friendsLists={friendsLists}
              isLoading={friendsListsLoading}
            />

            {/* Recent Travel Stories */}
            <RecentStories
              user={user}
              recentJournals={recentJournals}
              journalsLoading={journalsLoading}
            />
          </div>

          {/* Right Column - Profile & Discovery */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <ProfileSummary user={user} />

            {/* Discover Lists */}
            <DiscoverLists />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

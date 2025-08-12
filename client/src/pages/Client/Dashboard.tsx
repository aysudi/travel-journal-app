import { Link } from "react-router";
import { MapPin, Plus, Users, BookOpen, Crown, BarChart3 } from "lucide-react";
import { useUserProfile } from "../../hooks/useAuth";
import {
  useOwnedTravelLists,
  useCollaboratingTravelLists,
} from "../../hooks/useTravelList";
import { useJournalEntriesByAuthor } from "../../hooks/useEntries";
import formatDate from "../../utils/formatDate";
import Loading from "../../components/Common/Loading";
import ProfileSummary from "../../components/Client/Dashboard/ProfileSummary";
import RecentActivity from "../../components/Client/Dashboard/RecentActivity";
import StatsGrid from "../../components/Client/Dashboard/StatsGrid";
import {
  useAcceptInvitation,
  useRejectInvitation,
  usePendingReceivedInvitations,
} from "../../hooks/useListInvitations";
import RecentStories from "../../components/Client/Dashboard/RecentStories";
import DiscoverLists from "../../components/Client/Dashboard/DiscoverLists";
import CollaboratingLists from "../../components/Client/Dashboard/CollaboratingLists";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: ownedLists } = useOwnedTravelLists();
  const { data: collaboratingLists } = useCollaboratingTravelLists();

  const { data: recentJournalsData, isLoading: journalsLoading } =
    useJournalEntriesByAuthor(user?.id || "");

  const { data: pendingInvitations } = usePendingReceivedInvitations(
    user?.id || ""
  );

  // Move the hook calls to the top level
  const acceptInvitationMutation = useAcceptInvitation();
  const rejectInvitationMutation = useRejectInvitation();

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

  const handleAcceptInvitation = (invitationId: string) => {
    acceptInvitationMutation.mutate(invitationId, {
      onSuccess: (acceptedInvitation) => {
        const listTitle = typeof acceptedInvitation.list === 'object' 
          ? acceptedInvitation.list.title 
          : 'the travel list';
        
        Swal.fire({
          title: "Invitation Accepted!",
          text: `You've successfully joined "${listTitle}" as a ${acceptedInvitation.permissionLevel}.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      },
      onError: (error) => {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Failed to accept invitation",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    });
  };

  const handleRejectInvitation = (invitationId: string) => {
    rejectInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        Swal.fire({
          title: "Invitation Rejected!",
          text: "The invitation has been rejected.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      },
      onError: (error) => {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Failed to reject invitation",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    });
  };

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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      Pending Invitations
                    </h2>
                    <span className="text-sm text-slate-500">
                      {pendingInvitations.length} invitation
                      {pendingInvitations.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingInvitations
                      .slice(0, 3)
                      .map((invitation: any, ind: number) => (
                        <div
                          key={ind}
                          className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">
                                  {invitation.list?.title || "Unknown List"}
                                </h3>
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                  {invitation.permissionLevel}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">
                                <span className="font-medium">
                                  {invitation.inviter?.fullName || "Someone"}
                                </span>{" "}
                                invited you to collaborate
                              </p>
                              {invitation.list?.description && (
                                <p className="text-sm text-slate-500 mb-3">
                                  {invitation.list.description.length > 80
                                    ? `${invitation.list.description.substring(
                                        0,
                                        80
                                      )}...`
                                    : invitation.list.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                  Expires: {formatDate(invitation.expiresAt)}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      handleAcceptInvitation(invitation._id);
                                    }}
                                    disabled={
                                      acceptInvitationMutation.isPending
                                    }
                                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-green-50 disabled:text-green-400 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  >
                                    {acceptInvitationMutation.isPending
                                      ? "Accepting..."
                                      : "Accept"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "Are you sure?",
                                        text: "You won't be able to revert this!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText:
                                          "Yes, reject invitation!",
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          handleRejectInvitation(
                                            invitation._id
                                          );
                                        }
                                      });
                                    }}
                                    disabled={
                                      rejectInvitationMutation.isPending
                                    }
                                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-red-50 disabled:text-red-400 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  >
                                    {rejectInvitationMutation.isPending
                                      ? "Declining..."
                                      : "Decline"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {pendingInvitations.length > 3 && (
                    <div className="mt-4 text-center">
                      <Link
                        to="/invitations"
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium hover:bg-amber-50 px-3 py-1 rounded-md transition-all duration-200"
                      >
                        View all {pendingInvitations.length} invitations
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

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

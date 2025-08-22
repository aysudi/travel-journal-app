import React, { useState } from "react";
import { useParams } from "react-router";
import { Plus, Users } from "lucide-react";
import { useTravelList } from "../../hooks/useTravelList";
import Loading from "../../components/Common/Loading";
import { useJournalEntriesByTravelList } from "../../hooks/useEntries";
import {
  useDestinationsByTravelList,
  useCreateDestination,
  useUpdateDestination,
  destinationKeys,
} from "../../hooks/useDestination";
import { useQueryClient } from "@tanstack/react-query";
import type { Destination, JournalEntry } from "../../types/api";
import Swal from "sweetalert2";
import AddDestinationModal from "../../components/Client/ListDetails/AddDestinationModal";
import OwnersSection from "../../components/Client/ListDetails/OwnersSection";
import CoverImage from "../../components/Client/ListDetails/CoverImage";
import EditDestinationModal from "../../components/Client/ListDetails/EditDestinationModal";
import InvitationModal from "../../components/Client/ListDetails/InvitationModal";
import DestinationDetails from "../../components/Client/ListDetails/DestinationDetails";
import Navigation from "../../components/Client/ListDetails/Navigation";
import { useUserProfile } from "../../hooks/useAuth";

const ListDetails = () => {
  const { listId } = useParams<{ listId: string }>();

  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDestinationDetail, setShowDestinationDetail] = useState(false);
  const [showEditDestination, setShowEditDestination] = useState(false);
  const [_, setSelectedImageIndex] = useState(0);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const { data: travelList, isLoading, error } = useTravelList(listId || "");
  const {
    data: destinations,
    isLoading: isLoadingDestinations,
    error: errorDestinations,
  } = useDestinationsByTravelList(listId || "");
  const {
    data: journals,
    isLoading: isLoadingJournals,
    error: errorJournals,
  } = useJournalEntriesByTravelList(listId || "");
  const createDestination = useCreateDestination();
  const queryClient = useQueryClient();
  const editDestination = useUpdateDestination();
  const { data: user } = useUserProfile();

  const destinationsArray = destinations || [];
  const [journalsArrayState, setJournalsArrayState] = useState<any>([]);
  const journalsArray =
    journalsArrayState.length > 0 ? journalsArrayState : journals || [];
  React.useEffect(() => {
    if (journals) {
      setJournalsArrayState([]);
    }
  }, [journals]);
  const getDestinationStatus = (dest: Destination): string => dest.status;

  let hasFullAccess = false;
  if (travelList && user) {
    if (typeof travelList.owner === "string") {
      hasFullAccess = user.id === travelList.owner;
    } else if (travelList.owner && typeof travelList.owner === "object") {
      hasFullAccess =
        user.id === travelList.owner.id ||
        (travelList.owner &&
          (travelList.owner as any)._id &&
          user.id === (travelList.owner as any)._id);
    }
    if (Array.isArray(travelList.customPermissions)) {
      for (const perm of travelList.customPermissions) {
        const permUserId =
          typeof perm.user === "string"
            ? perm.user
            : perm.user?.id || (perm.user && (perm.user as any)._id);
        if (
          permUserId === user.id &&
          (perm.level === "contribute" || perm.level === "co-owner")
        ) {
          hasFullAccess = true;
          break;
        }
      }
    }
  }

  if (isLoading || isLoadingDestinations || isLoadingJournals) {
    return <Loading variant="page" />;
  }

  if (
    error ||
    !travelList ||
    !destinations ||
    !journals ||
    errorDestinations ||
    errorJournals
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-medium">Travel list not found</p>
            <p className="text-sm mt-1">
              The list you're looking for doesn't exist or you don't have access
              to it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Visited":
        return "bg-green-100 text-green-800";
      case "Planned":
        return "bg-blue-100 text-blue-800";
      case "Wishlist":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setSelectedImageIndex(0);
    setShowDestinationDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Cover Image Section */}
      <CoverImage travelList={travelList} isOwner={!!hasFullAccess} />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Owner and Collaborators Section */}
        <OwnersSection travelList={travelList} />

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {(destinationsArray as Destination[]).length}
                </div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {(journalsArray as JournalEntry[]).length}
                </div>
                <div className="text-sm text-gray-600">Journals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {
                    (destinationsArray as Destination[]).filter(
                      (d: Destination) => !!d.dateVisited
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Visited</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Only show invite button for private lists */}
              {travelList?.visibility === "private" && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Users size={18} />
                  <span>Invite</span>
                </button>
              )}
              {hasFullAccess && (
                <>
                  <button
                    onClick={() => setShowAddDestination(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Plus size={18} />
                    <span>Add Destination</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Navigation
          destinationsArray={destinationsArray}
          handleDestinationClick={handleDestinationClick}
          journalsArray={journalsArray}
          setShowAddDestination={setShowAddDestination}
          getDestinationStatus={getDestinationStatus}
          getStatusColor={getStatusColor}
          setJournalsArrayState={setJournalsArrayState}
          listId={listId}
          journals={journals}
        />
      </div>
      {/* Add Destination Modal */}
      {showAddDestination && (
        <AddDestinationModal
          onClose={() => setShowAddDestination(false)}
          onSubmit={async (formData: FormData) => {
            if (listId) {
              formData.append("list", listId);
            }
            setShowAddDestination(false);
            await createDestination.mutateAsync(formData, {
              onSuccess: () => {
                if (listId) {
                  queryClient.invalidateQueries({
                    queryKey: destinationKeys.byTravelList(listId),
                  });
                }
                Swal.fire({
                  title: "Destination created successfully!",
                  icon: "success",
                  draggable: true,
                });
              },
            });
          }}
        />
      )}
      {showEditDestination && (
        <EditDestinationModal
          destination={selectedDestination}
          onClose={() => setShowEditDestination(false)}
          onSubmit={async (formData: any) => {
            setShowEditDestination(false);
            const id = formData.get("id");
            await editDestination.mutateAsync(
              { id, data: formData },
              {
                onSuccess: () => {
                  if (listId) {
                    queryClient.invalidateQueries({
                      queryKey: destinationKeys.byTravelList(listId),
                    });
                  }
                  Swal.fire({
                    title: "Destination updated successfully!",
                    icon: "success",
                    draggable: true,
                  });
                },
              }
            );
          }}
        />
      )}
      {/* Invite Modal */}
      {showInviteModal && (
        <InvitationModal
          list={travelList}
          setShowInviteModal={setShowInviteModal}
        />
      )}
      {/* Destination Details Modal */}
      {showDestinationDetail && selectedDestination && (
        <DestinationDetails
          destination={selectedDestination}
          isOpen={showDestinationDetail}
          onClose={() => setShowDestinationDetail(false)}
          onEdit={() => {
            setShowEditDestination(true);
            setShowDestinationDetail(false);
          }}
          onDelete={() => {
            // You may want to implement delete logic here or in the modal
          }}
          isOwner={!!hasFullAccess}
        />
      )}
    </div>
  );
};

export default ListDetails;

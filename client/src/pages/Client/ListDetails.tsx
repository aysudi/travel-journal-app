import React, { useState, useRef } from "react";
import { useParams } from "react-router";
import {
  MapPin,
  Calendar,
  Camera,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Users,
  BookOpen,
  Globe,
  Lock,
  MoreVertical,
  UserCheck,
  Eye,
} from "lucide-react";
import { useTravelList } from "../../hooks/useTravelList";
import Loading from "../../components/Common/Loading";
import { useJournalEntriesByTravelList } from "../../hooks/useEntries";
import {
  useCreateDestination,
  useDestinationsByTravelList,
  destinationKeys,
} from "../../hooks/useDestination";
import { useQueryClient } from "@tanstack/react-query";
import type { Destination, JournalEntry } from "../../types/api";
import Swal from "sweetalert2";
import AddDestinationModal from "../../components/Client/ListDetails/AddDestinationModal";
import NavigationTabs from "../../components/Client/ListDetails/NavigationTabs";
import DestinationsTabs from "../../components/Client/ListDetails/DestinationsTabs";
import JournalsTabs from "../../components/Client/ListDetails/JournalsTabs";
import PhotosTab from "../../components/Client/ListDetails/PhotosTab";

const ListDetails = () => {
  const { listId } = useParams<{ listId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    "destinations" | "journals" | "photos"
  >("destinations");
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDestinationDetail, setShowDestinationDetail] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const destinationsArray = destinations || [];
  const journalsArray = journals || [];

  const getDestinationStatus = (dest: Destination): string => dest.status;

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

  const handleCoverImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setSelectedImageIndex(0);
    setShowDestinationDetail(true);
  };

  const handleImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Cover Image Section */}
      <div className="relative h-140 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        {travelList?.coverImage ? (
          <img
            src={travelList.coverImage}
            alt={travelList.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Cover Image Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleCoverImageUpload}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            <Camera size={20} />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
            <Share2 size={20} />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* List Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            {travelList?.visibility === "public" ? (
              <Globe size={16} className="text-white/80" />
            ) : travelList?.visibility === "friends" ? (
              <UserCheck size={16} className="text-white/80" />
            ) : (
              <Lock size={16} className="text-white/80" />
            )}
            <span className="text-white/80 text-sm capitalize">
              {travelList?.visibility || "Private"} List
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {travelList?.title}
          </h1>
          {travelList?.description && (
            <p className="text-white/90 text-lg max-w-2xl">
              {travelList.description}
            </p>
          )}

          {/* Tags */}
          {travelList?.tags && travelList.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {travelList.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Owner and Collaborators Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            List Members
          </h3>
          <div
            className={`grid grid-cols-1 gap-6 ${
              travelList?.customPermissions?.filter(
                (p: any) => p.level === "co-owner"
              )?.length > 0 &&
              travelList?.customPermissions?.filter(
                (p: any) => p.level !== "co-owner"
              )?.length > 0
                ? "md:grid-cols-3"
                : travelList?.customPermissions?.filter(
                    (p: any) => p.level === "co-owner"
                  )?.length > 0 ||
                  travelList?.customPermissions?.filter(
                    (p: any) => p.level !== "co-owner"
                  )?.length > 0
                ? "md:grid-cols-2"
                : "md:grid-cols-1"
            }`}
          >
            {/* Owner */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                <Users size={16} />
                Owner
              </h4>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                {(travelList?.owner as any)?.profileImage ? (
                  <img
                    src={(travelList.owner as any).profileImage}
                    alt={(travelList.owner as any).fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ring-2 ring-indigo-200">
                    <span className="text-white font-semibold text-sm">
                      {(travelList?.owner as any)?.fullName
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {(travelList?.owner as any)?.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    @{(travelList?.owner as any)?.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Co-owners - Only show if they exist */}
            {travelList?.customPermissions?.filter(
              (p: any) => p.level === "co-owner"
            )?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                  <UserCheck size={16} />
                  Co-owners (
                  {travelList?.customPermissions?.filter(
                    (p: any) => p.level === "co-owner"
                  )?.length || 0}
                  )
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {travelList.customPermissions
                    .filter((p: any) => p.level === "co-owner")
                    .map((permission: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100"
                      >
                        {permission.user?.profileImage ? (
                          <img
                            src={permission.user.profileImage}
                            alt={permission.user.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {permission.user?.fullName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {permission.user?.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            @{permission.user?.username}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Other Collaborators - Only show if they exist */}
            {travelList?.customPermissions?.filter(
              (p: any) => p.level !== "co-owner"
            )?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Collaborators (
                  {travelList?.customPermissions?.filter(
                    (p: any) => p.level !== "co-owner"
                  )?.length || 0}
                  )
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {travelList.customPermissions
                    .filter((p: any) => p.level !== "co-owner")
                    .map((permission: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        {permission.user?.profileImage ? (
                          <img
                            src={permission.user.profileImage}
                            alt={permission.user.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {permission.user?.fullName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {permission.user?.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            @{permission.user?.username} • {permission.level}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
              <button
                onClick={() => setShowAddDestination(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus size={18} />
                <span>Add Destination</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            destinationsArray={destinationsArray}
            journalsArray={journalsArray}
          />

          {/* Tab Content */}
          <div className="p-6">
            {/* Destinations Tab */}
            {activeTab === "destinations" && (
              <DestinationsTabs
                setShowAddDestination={setShowAddDestination}
                getStatusColor={getStatusColor}
                getDestinationStatus={getDestinationStatus}
                handleDestinationClick={handleDestinationClick}
                destinationsArray={destinationsArray}
              />
            )}

            {/* Journals Tab */}
            {activeTab === "journals" && (
              <div>
                <div className="space-y-6">
                  {(journalsArray as JournalEntry[]).map(
                    (journal: JournalEntry, idx: number) => {
                      return (
                        <JournalsTabs
                          key={idx}
                          journal={journal}
                          listId={listId}
                        />
                      );
                    }
                  )}
                </div>

                {/* Empty State for Journals */}
                {(journalsArray as JournalEntry[]).length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen
                      size={64}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No journals yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start documenting your travel experiences by creating your
                      first journal entry
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Plus size={20} />
                      <span>Write Your First Journal</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <PhotosTab
                destinationsArray={destinationsArray}
                journalsArray={journalsArray}
              />
            )}
          </div>
        </div>
      </div>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

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
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-2">
              Invite Users to Private List
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Give others access to your private travel list and set their
              permission level.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email or username to invite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="view">
                    View Only - Can view destinations and journals
                  </option>
                  <option value="suggest">
                    Suggest - Can suggest destinations
                  </option>
                  <option value="contribute">
                    Contribute - Can add destinations and journals
                  </option>
                  <option value="co-owner">
                    Co-owner - Full access except deletion
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Add a personal message to your invitation..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer">
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Destination Detail Modal */}
      {showDestinationDetail && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header with Image */}
            <div className="relative h-82 bg-gray-200 overflow-hidden">
              {selectedDestination.images[selectedImageIndex] ? (
                <img
                  src={selectedDestination.images[selectedImageIndex]}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <MapPin size={64} className="text-indigo-400" />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDestinationDetail(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer"
              >
                ×
              </button>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    getDestinationStatus(selectedDestination)
                  )}`}
                >
                  {getDestinationStatus(selectedDestination)}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedDestination.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{selectedDestination.location}</span>
                </div>

                {/* Date Info */}
                {selectedDestination.dateVisited && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar size={18} />
                    <span>
                      Visited on{" "}
                      {new Date(
                        selectedDestination.dateVisited
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {selectedDestination.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedDestination.notes}
                    </p>
                  </div>
                )}

                {/* Images Gallery */}
                {selectedDestination.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedDestination.images.map(
                        (image: string, index: number) => (
                          <div
                            key={index}
                            className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                              selectedImageIndex === index
                                ? "ring-2 ring-indigo-500 ring-offset-2"
                                : ""
                            }`}
                            onClick={() => handleImageClick(index)}
                          >
                            <img
                              src={image}
                              alt={`${selectedDestination.name} photo ${
                                index + 1
                              }`}
                              className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            {selectedImageIndex === index && (
                              <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                <div className="bg-white rounded-full p-2">
                                  <Eye size={16} className="text-indigo-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <Edit3 size={18} />
                  <span>Edit</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <BookOpen size={18} />
                  <span>Add Journal</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <Camera size={18} />
                  <span>Add Photos</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-auto cursor-pointer">
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetails;

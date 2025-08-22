import { Calendar, Camera, Edit3, Eye, MapPin, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  destinationKeys,
  useDeleteDestination,
} from "../../../hooks/useDestination";
import type { Destination } from "../../../services";
import { useQueryClient } from "@tanstack/react-query";

const DestinationDetails = ({
  setShowDestinationDetail,
  selectedImageIndex,
  selectedDestination,
  setShowEditDestination,
  setSelectedImageIndex,
  getDestinationStatus,
  getStatusColor,
}: any) => {
  const deleteDestination = useDeleteDestination();
  const queryClient = useQueryClient();

  const handleImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header with Image */}
        <div className="relative h-100 bg-gray-200 overflow-hidden shadow-2xl">
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
                          alt={`${selectedDestination.name} photo ${index + 1}`}
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
            <button
              onClick={() => {
                setShowEditDestination(true);
                setShowDestinationDetail(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <Edit3 size={18} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                setShowDestinationDetail(false);
                setShowEditDestination(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <Camera size={18} />
              <span>Add Photos</span>
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
                  confirmButtonText: "Yes, delete it!",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await deleteDestination.mutateAsync(selectedDestination.id);
                    queryClient.setQueryData(
                      destinationKeys.byTravelList(selectedDestination.list),
                      (old: Destination[] | undefined) =>
                        old?.filter((d) => d.id !== selectedDestination.id)
                    );
                    setShowDestinationDetail(false);

                    Swal.fire({
                      title: "Deleted!",
                      text: "Your destination has been deleted.",
                      icon: "success",
                    });
                  }
                });
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-auto cursor-pointer"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;

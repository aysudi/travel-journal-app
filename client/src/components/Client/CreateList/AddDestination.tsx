import { Plus, Calendar } from "lucide-react";
import { useState } from "react";
import Images from "./Images";
import type { DestinationFormData } from "../../../services";

type Props = {
  destinations: DestinationFormData[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationFormData[]>>;
};

const AddDestination = ({ destinations, setDestinations }: Props) => {
  const [currentDestination, setCurrentDestination] =
    useState<DestinationFormData>({
      name: "",
      location: "",
      status: "wishlist",
      datePlanned: "",
      dateVisited: "",
      notes: "",
      images: [],
    });

  const [destinationImagePreviews, setDestinationImagePreviews] = useState<
    string[]
  >([]);

  const addDestination = () => {
    if (currentDestination.name && currentDestination.location) {
      setDestinations([...destinations, currentDestination]);
      setCurrentDestination({
        name: "",
        location: "",
        status: "wishlist",
        datePlanned: "",
        dateVisited: "",
        notes: "",
        images: [],
      });
      setDestinationImagePreviews([]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Add New Destination
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination Name *
          </label>
          <input
            type="text"
            value={currentDestination.name}
            onChange={(e) =>
              setCurrentDestination({
                ...currentDestination,
                name: e.target.value,
              })
            }
            placeholder="Paris, Tokyo, Bali..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={currentDestination.location}
            onChange={(e) =>
              setCurrentDestination({
                ...currentDestination,
                location: e.target.value,
              })
            }
            placeholder="France, Japan, Indonesia..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentDestination({
                  ...currentDestination,
                  status: "wishlist",
                })
              }
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                currentDestination.status === "wishlist"
                  ? "border-gray-500 bg-gray-50 text-gray-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">Wishlist</div>
              <div className="text-sm opacity-75">Want to visit</div>
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentDestination({
                  ...currentDestination,
                  status: "planned",
                })
              }
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                currentDestination.status === "planned"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">Planned</div>
              <div className="text-sm opacity-75">Trip booked</div>
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentDestination({
                  ...currentDestination,
                  status: "visited",
                })
              }
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                currentDestination.status === "visited"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">Visited</div>
              <div className="text-sm opacity-75">Been there</div>
            </button>
          </div>
        </div>

        {/* Date fields based on status */}
        {currentDestination.status === "planned" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Planned Date
            </label>
            <input
              type="date"
              value={currentDestination.datePlanned}
              onChange={(e) =>
                setCurrentDestination({
                  ...currentDestination,
                  datePlanned: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
        )}

        {currentDestination.status === "visited" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Visit Date
            </label>
            <input
              type="date"
              value={currentDestination.dateVisited}
              onChange={(e) =>
                setCurrentDestination({
                  ...currentDestination,
                  dateVisited: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
        )}

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={currentDestination.notes}
            onChange={(e) =>
              setCurrentDestination({
                ...currentDestination,
                notes: e.target.value,
              })
            }
            placeholder="Any special notes about this destination..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Images */}
        <Images
          destinationImagePreviews={destinationImagePreviews}
          setCurrentDestination={setCurrentDestination}
          currentDestination={currentDestination}
          setDestinationImagePreviews={setDestinationImagePreviews}
        />
      </div>

      {/* Add Destination Button */}
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={addDestination}
          disabled={
            !currentDestination.name.trim() ||
            !currentDestination.location.trim()
          }
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>
    </div>
  );
};

export default AddDestination;

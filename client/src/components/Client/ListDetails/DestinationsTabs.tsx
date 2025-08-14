import { Filter, MapPin, Plus, SortAsc } from "lucide-react";
import DestinationsGrid from "./DestinationsGrid";
import type { Destination } from "../../../services";
import { useState } from "react";

type Props = {
  destinationsArray: Destination[];
  handleDestinationClick: (destination: Destination) => void;
  getStatusColor: (status: string) => string;
  setShowAddDestination: (show: boolean) => void;
  getDestinationStatus: (destination: Destination) => string;
};

const DestinationsTabs = ({
  destinationsArray,
  handleDestinationClick,
  getStatusColor,
  getDestinationStatus,
  setShowAddDestination,
}: Props) => {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Wishlist" | "Planned" | "Visited"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest"
  );

  const filteredDestinations = (destinationsArray as Destination[]).filter(
    (dest: Destination) => {
      if (filterStatus === "all") return true;
      return dest.status === filterStatus;
    }
  );

  const sortedDestinations = filteredDestinations.sort(
    (a: Destination, b: Destination) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    }
  );

  return (
    <div>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Planned">Planned</option>
              <option value="Visited">Visited</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Showing {sortedDestinations.length} destinations
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDestinations.map((destination: Destination) => {
          const status = getDestinationStatus(destination);
          return (
            <DestinationsGrid
              getStatusColor={getStatusColor}
              key={destination.id}
              status={status}
              destination={destination}
              handleDestinationClick={handleDestinationClick}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {sortedDestinations.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No destinations found
          </h3>
          <p className="text-gray-500 mb-6">
            {filterStatus === "all"
              ? "Start building your travel list by adding your first destination"
              : `No destinations with status "${filterStatus}"`}
          </p>
          <button
            onClick={() => setShowAddDestination(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Add Your First Destination</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationsTabs;

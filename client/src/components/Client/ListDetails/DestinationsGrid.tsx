import { Calendar, MapPin } from "lucide-react";
import type { Destination } from "../../../services";

type Props = {
  status: string;
  destination: Destination;
  handleDestinationClick: (destination: Destination) => void;
  getStatusColor: (status: string) => string;
};

const DestinationsGrid = ({
  status,
  destination,
  handleDestinationClick,
  getStatusColor,
}: Props) => {
  return (
    <div
      key={destination.id}
      onClick={() => handleDestinationClick(destination)}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Destination Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {destination.images[0] ? (
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <MapPin size={48} className="text-indigo-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Destination Info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
          {destination.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={16} />
          <span className="text-sm">{destination.location}</span>
        </div>

        {/* Date Info */}
        {destination.dateVisited && (
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <Calendar size={16} />
            <span className="text-sm">
              Visited {new Date(destination.dateVisited).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Notes Preview */}
        {destination.notes && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {destination.notes}
          </p>
        )}
      </div>
    </div>
  );
};

export default DestinationsGrid;

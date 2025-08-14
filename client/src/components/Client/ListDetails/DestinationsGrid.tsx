import { BookOpen, Calendar, Edit3, Heart, MapPin, Trash2 } from "lucide-react";
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

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer">
              <Edit3 size={14} />
            </button>
            <button className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors duration-200">
            <BookOpen size={16} />
            <span>Add Journal</span>
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationsGrid;

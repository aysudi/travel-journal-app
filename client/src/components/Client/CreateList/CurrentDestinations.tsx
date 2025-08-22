import { MapPin, X } from "lucide-react";
import type { DestinationFormData } from "../../../services";

type CurrentDestinationsProps = {
  destinations: DestinationFormData[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationFormData[]>>;
};

const CurrentDestinations = ({
  destinations,
  setDestinations,
}: CurrentDestinationsProps) => {
  const removeDestination = (indexToRemove: number) => {
    setDestinations(destinations.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Added Destinations ({destinations.length})
      </h3>
      <div className="space-y-3">
        {destinations.map((dest, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <MapPin
                size={18}
                className={`${
                  dest.status === "visited"
                    ? "text-green-500"
                    : dest.status === "planned"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              />
              <div>
                <div className="font-medium text-gray-800">{dest.name}</div>
                <div className="text-sm text-gray-600">
                  {dest.location} • {dest.status}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeDestination(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-1 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentDestinations;

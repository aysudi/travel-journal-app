import { Camera } from "lucide-react";
import type { Destination, JournalEntry } from "../../../services";

type PhotosTabProps = {
  destinationsArray: Destination[];
  journalsArray: any;
};

const PhotosTab = ({ destinationsArray, journalsArray }: PhotosTabProps) => {
  return (
    <div>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(destinationsArray as Destination[])
          .flatMap((d: Destination) => d.images)
          .concat(
            (journalsArray as JournalEntry[]).flatMap(
              (j: JournalEntry) => j.photos
            )
          )
          .map((photo: string, index: number) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
      </div>

      {/* Empty State for Photos */}
      {(destinationsArray as Destination[])
        .flatMap((d: Destination) => d.images)
        .concat(
          (journalsArray as JournalEntry[]).flatMap(
            (j: JournalEntry) => j.photos
          )
        ).length === 0 && (
        <div className="text-center py-12">
          <Camera size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No photos yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add photos to your destinations and journals to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;

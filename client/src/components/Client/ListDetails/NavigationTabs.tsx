import { BookOpen, Camera, MapPin } from "lucide-react";
import type { Destination, JournalEntry } from "../../../services";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  activeTab: string;
  setActiveTab: Dispatch<
    SetStateAction<"destinations" | "journals" | "photos">
  >;
  destinationsArray: Destination[];
  journalsArray: any;
};

const NavigationTabs = ({
  activeTab,
  setActiveTab,
  destinationsArray,
  journalsArray,
}: Props) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex">
        <button
          onClick={() => setActiveTab("destinations")}
          className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === "destinations"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <MapPin size={18} />
            <span>
              Destinations ({(destinationsArray as Destination[]).length})
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("journals")}
          className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === "journals"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <BookOpen size={18} />
            <span>Journals ({(journalsArray as JournalEntry[]).length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === "photos"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Camera size={18} />
            <span>
              Photos (
              {
                (destinationsArray as Destination[])
                  .flatMap((d: Destination) => d.images)
                  .concat(
                    (journalsArray as JournalEntry[]).flatMap(
                      (j: JournalEntry) => j.photos
                    )
                  ).length
              }
              )
            </span>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default NavigationTabs;

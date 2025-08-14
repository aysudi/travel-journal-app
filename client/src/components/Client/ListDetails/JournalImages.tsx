import type { JournalEntry } from "../../../services";

const JournalImages = ({ journal }: { journal: JournalEntry }) => {
  return (
    <div className="mb-6">
      <div
        className={`grid gap-3 ${
          journal.photos.length === 1
            ? "grid-cols-1 max-w-md"
            : journal.photos.length === 2
            ? "grid-cols-2"
            : journal.photos.length === 3
            ? "grid-cols-3"
            : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {journal.photos.slice(0, 4).map((image: string, index: number) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={image}
              alt={`Journal photo ${index + 1}`}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                journal.photos.length === 1 ? "h-64" : "h-32 md:h-24"
              }`}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Photo indicator for multiple photos */}
            {journal.photos.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{journal.photos.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View all photos link */}
      {journal.photos.length > 4 && (
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 transition-colors duration-200">
          View all {journal.photos.length} photos
        </button>
      )}
    </div>
  );
};

export default JournalImages;

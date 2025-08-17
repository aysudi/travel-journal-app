import { useState } from "react";

const PhotosSection = ({ journal }: any) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <div className="mb-6">
      {journal.photos.length === 1 ? (
        <div className="px-6">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={journal.photos[0]}
              alt={journal.title}
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="px-6">
          {/* Main Image */}
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={journal.photos[selectedImageIndex]}
              alt={`${journal.title} ${selectedImageIndex + 1}`}
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImageIndex + 1} / {journal.photos.length}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {(showAllPhotos ? journal.photos : journal.photos.slice(0, 8)).map(
              (photo: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "ring-2 ring-indigo-500 opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${journal.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            )}

            {!showAllPhotos && journal.photos.length > 8 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 transition-colors duration-200"
              >
                +{journal.photos.length - 8}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosSection;

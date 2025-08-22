import { Image, X } from "lucide-react";

type ImagesProps = {
  destinationImagePreviews: string[];
  setCurrentDestination: React.Dispatch<React.SetStateAction<any>>;
  currentDestination: any;
  setDestinationImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
};

const Images = ({
  destinationImagePreviews,
  setCurrentDestination,
  currentDestination,
  setDestinationImagePreviews,
}: ImagesProps) => {
  const removeDestinationImage = (indexToRemove: number) => {
    setCurrentDestination({
      ...currentDestination,
      images: currentDestination.images.filter(
        (_: any, index: number) => index !== indexToRemove
      ),
    });
    setDestinationImagePreviews((prev: any) =>
      prev.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  const handleDestinationImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCurrentDestination({
        ...currentDestination,
        images: [...currentDestination.images, ...files],
      });

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDestinationImagePreviews((prev: any) => [
            ...prev,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images
      </label>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="destination-images"
            className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex flex-col items-center justify-center">
              <Image className="w-6 h-6 mb-1 text-gray-400" />
              <p className="text-sm text-gray-500">
                Add photos (multiple allowed)
              </p>
            </div>
            <input
              id="destination-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleDestinationImagesUpload}
            />
          </label>
        </div>
        {destinationImagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {destinationImagePreviews.map((preview: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeDestinationImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;

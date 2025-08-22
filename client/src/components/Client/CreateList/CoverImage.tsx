import { Upload, X } from "lucide-react";
import { useState } from "react";

const CoverImage = ({ createListFormik }: { createListFormik: any }) => {
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      createListFormik.setFieldValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cover Image
      </label>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="cover-image"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="cover-image"
              name="coverImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
            />
          </label>
        </div>
        {coverImagePreview && (
          <div className="relative inline-block">
            <img
              src={coverImagePreview}
              alt="Cover preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                createListFormik.setFieldValue("coverImage", null);
                setCoverImagePreview("");
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;

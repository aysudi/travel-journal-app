import { Camera } from "lucide-react";
import { useRef } from "react";

type ProfileImageProps = {
  imagePreview: string;
  user: {
    profileImage: string;
  };
  isEditing: boolean;
  setImagePreview: (preview: string) => void;
  setEditData: (data: any) => void;
};

const ProfileImage = ({
  imagePreview,
  user,
  isEditing,
  setImagePreview,
  setEditData,
}: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.currentTarget.files && file) {
      setImagePreview(URL.createObjectURL(file));
      setEditData((prev: any) => ({ ...prev, profileImage: file }));
    }
  };

  return (
    <div className="absolute -top-16 left-8">
      <div className="relative">
        <img
          src={imagePreview || user.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
          >
            <Camera size={16} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImage;

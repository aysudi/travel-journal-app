import { Edit3, Save, X } from "lucide-react";
import { useUpdateProfile } from "../../../hooks/useAuth";

type Props = {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editData: {
    fullName: string;
    username: string;
    profileVisibility: "public" | "private";
    profileImage: string | File;
  };
  setEditData: (data: Props["editData"]) => void;
  setImagePreview: (image: string) => void;
  user: any;
};

const ActionsButtons = ({
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  setImagePreview,
  user,
}: Props) => {
  const updateProfileMutation = useUpdateProfile();

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      fullName: user.fullName,
      username: user.username,
      profileVisibility: user.profileVisibility,
      profileImage: user.profileImage,
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", editData.fullName);
      formData.append("username", editData.username);
      formData.append("profileVisibility", editData.profileVisibility);

      if (editData.profileImage instanceof File) {
        formData.append("profileImage", editData.profileImage);
      }

      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      setImagePreview("");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview("");
    setEditData({
      fullName: user.fullName,
      username: user.username,
      profileVisibility: user.profileVisibility,
      profileImage: user.profileImage,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!isEditing ? (
        <button
          onClick={handleEdit}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      ) : (
        <>
          <button
            type="submit"
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
          >
            {updateProfileMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
          >
            <X size={18} />
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default ActionsButtons;

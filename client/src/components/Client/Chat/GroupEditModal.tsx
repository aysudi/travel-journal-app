import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface EditData {
  name: string;
  description: string;
  avatar: string | File;
}

type Props = {
  setEditData: React.Dispatch<React.SetStateAction<EditData>>;
  editData: EditData;
  setShowGroupEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditChat: () => Promise<void>;
};

const GroupEditModal = ({
  setEditData,
  editData,
  setShowGroupEdit,
  handleEditChat,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.currentTarget.files && file) {
      setImagePreview(URL.createObjectURL(file));
      setEditData((prev: any) => ({ ...prev, avatar: file }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setShowGroupEdit(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">
          Edit Group Info
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer relative group"
            >
              {imagePreview || editData.avatar ? (
                <img
                  src={
                    imagePreview
                      ? imagePreview
                      : editData.avatar instanceof File
                        ? URL.createObjectURL(editData.avatar)
                        : (editData.avatar as string | undefined)
                  }
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-300"
                  onError={(e) => {
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview("");
                    }
                    (e.target as HTMLImageElement).src =
                      editData.avatar as string;
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400">
                  <Camera size={32} />
                </div>
              )}
              <input
                ref={fileInputRef}
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleImageChange(e);
                }}
              />
              <span className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition">
                Edit
              </span>
            </label>
          </div>
          <input
            className="px-3 py-2 rounded border border-indigo-200"
            placeholder="Group Name"
            value={editData.name}
            onChange={(e) =>
              setEditData((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <textarea
            className="px-3 py-2 rounded border border-indigo-200 min-h-[60px]"
            placeholder="Description"
            value={editData.description}
            onChange={(e) =>
              setEditData((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <button
            className="mt-2 px-4 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition cursor-pointer"
            onClick={() => {
              handleEditChat();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupEditModal;

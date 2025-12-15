import React, { useState, useEffect } from "react";
import { X, Loader2, Upload, Trash2, Crown } from "lucide-react";
import type { CreateJournalEntryData, Destination } from "../../../services";
import { useUserProfile } from "../../../hooks/useAuth";
import Loading from "../../Common/Loading";
import { useLimitCheck } from "../../../hooks/useLimits";
import PremiumUpgradeModal from "../../Common/PremiumUpgradeModal";

interface CreateJournalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJournalEntryData) => void;
  destinations: Destination[];
  loading?: boolean;
}

const CreateJournalModal: React.FC<CreateJournalModalProps> = ({
  open,
  onClose,
  onSubmit,
  destinations,
  loading = false,
}) => {
  const { data: user } = useUserProfile();
  const { checkJournalEntryLimit, getImageLimit } = useLimitCheck();
  const journalLimit = checkJournalEntryLimit();
  const imageLimit = getImageLimit();

  if (!user) return <Loading />;

  const [form, setForm] = useState<CreateJournalEntryData>({
    author: user?.id,
    title: "",
    content: "",
    destination: undefined,
    public: true,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check journal entry limit on open
  useEffect(() => {
    if (open && !journalLimit.canCreate) {
      setShowUpgradeModal(true);
    }
  }, [open, journalLimit.canCreate]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: CreateJournalEntryData) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check image limit based on user's premium status
    const maxImages = imageLimit.limit;
    const remainingSlots = maxImages - selectedImages.length;

    if (remainingSlots <= 0) {
      if (!imageLimit.isPremium) {
        setShowUpgradeModal(true);
      }
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    setSelectedImages((prev) => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check journal limit before submitting
    if (!journalLimit.canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    selectedImages.forEach((image) => {
      formData.append("photos", image);
    });

    onSubmit(formData as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
          disabled={loading}
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          Create New Journal Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
              disabled={loading}
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 min-h-[100px] focus:ring-2 focus:ring-indigo-400"
              required
              disabled={loading}
              placeholder="Enter content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <select
              name="destination"
              value={form.destination || ""}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
              disabled={loading}
            >
              <option value="">Select destination</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.location})
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Photos ({selectedImages.length}/{imageLimit.limit})
              </label>
              {!imageLimit.isPremium && (
                <span className="text-xs text-orange-600">
                  Upgrade to add up to 5 photos
                </span>
              )}
            </div>

            {/* Upload Button */}
            {selectedImages.length < imageLimit.limit && (
              <div className="mb-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 5MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </label>
              </div>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      disabled={loading}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <div className="flex gap-4">
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                  form.public
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name="public"
                  value="true"
                  checked={form.public === true}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, public: true }))
                  }
                  className="form-radio text-indigo-600"
                  disabled={loading}
                />
                Public
              </label>
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                  !form.public
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name="public"
                  value="false"
                  checked={form.public === false}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, public: false }))
                  }
                  className="form-radio text-indigo-600"
                  disabled={loading}
                />
                Private
              </label>
            </div>
          </div>
          {/* Journal Limit Warning */}
          {!journalLimit.canCreate && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                <span className="font-medium">Journal limit reached!</span>{" "}
                You've created {journalLimit.usage}/{journalLimit.limit} journal
                entries.
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Upgrade to Premium
                </button>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !journalLimit.canCreate}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : !journalLimit.canCreate ? (
              <>
                <Crown size={20} />
                Upgrade to Create More Journals
              </>
            ) : (
              "Create Journal"
            )}
          </button>
        </form>
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="journals"
        currentUsage={journalLimit.usage}
        limit={journalLimit.limit}
      />
    </div>
  );
};

export default CreateJournalModal;

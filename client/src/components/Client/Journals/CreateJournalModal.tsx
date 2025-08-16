import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { CreateJournalEntryData, Destination } from "../../../services";
import { useUserProfile } from "../../../hooks/useAuth";
import Loading from "../../Common/Loading";

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

  if (!user) return <Loading />;

  const [form, setForm] = useState<CreateJournalEntryData>({
    author: user?.id,
    title: "",
    content: "",
    destination: undefined,
    public: true,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: CreateJournalEntryData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    onSubmit(form);
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={form.public}
              onChange={() =>
                setForm((prev: CreateJournalEntryData) => ({
                  ...prev,
                  public: !prev.public,
                }))
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              disabled={loading}
            />
            <label className="text-sm text-gray-700">
              Make this journal public
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create Journal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalModal;

import { useState } from "react";

const AddDestinationModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (destination: any) => void;
}) => {
  const [newDestination, setNewDestination] = useState<any>({
    name: "",
    location: "",
    status: "Wishlist",
    dateVisited: "",
    datePlanned: "",
    notes: "",
    images: [] as File[],
    imagePreviews: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewDestination((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDestinationImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewDestination((prev: any) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [
        ...prev.imagePreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    if (status === "Visited") {
      setNewDestination((prev: any) => ({
        ...prev,
        status,
        dateVisited: status === "Visited" ? prev.dateVisited : "",
      }));
    } else if (status === "Planned") {
      setNewDestination((prev: any) => ({
        ...prev,
        status,
        datePlanned: status === "Planned" ? prev.datePlanned : "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newDestination.name);
    formData.append("location", newDestination.location);
    formData.append("status", newDestination.status);
    if (newDestination.dateVisited)
      formData.append("dateVisited", newDestination.dateVisited);
    if (newDestination.datePlanned)
      formData.append("datePlanned", newDestination.datePlanned);
    if (newDestination.notes) formData.append("notes", newDestination.notes);
    if (newDestination.images && newDestination.images.length > 0) {
      newDestination.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }
    onSubmit(formData);
    setNewDestination({
      name: "",
      location: "",
      status: "Wishlist",
      dateVisited: "",
      datePlanned: "",
      notes: "",
      images: [],
      imagePreviews: [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Destination</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Name *
            </label>
            <input
              type="text"
              name="name"
              value={newDestination.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Eiffel Tower"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={newDestination.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Paris, France"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={newDestination.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Planned">Planned</option>
              <option value="Visited">Visited</option>
            </select>
          </div>
          {/* Conditional date fields */}
          {newDestination.status === "Visited" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Visited
              </label>
              <input
                type="date"
                name="dateVisited"
                value={newDestination.dateVisited}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          {newDestination.status === "Planned" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Planned
              </label>
              <input
                type="date"
                name="datePlanned"
                value={newDestination.datePlanned}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              value={newDestination.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Add any notes about this destination..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleDestinationImageUpload}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Image previews */}
            {newDestination.imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {newDestination.imagePreviews.map(
                  (src: string, idx: number) => (
                    <div key={idx} className="relative w-16 h-16">
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewDestination((prev: any) => ({
                            ...prev,
                            images: prev.images.filter(
                              (_: string, i: number) => i !== idx
                            ),
                            imagePreviews: prev.imagePreviews.filter(
                              (_: string, i: number) => i !== idx
                            ),
                          }));
                        }}
                        className="absolute top-[-4px] right-[-4px] bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
            >
              Add Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationModal;

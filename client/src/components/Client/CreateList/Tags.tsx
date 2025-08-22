import { Tag, X } from "lucide-react";
import { useState } from "react";

const Tags = ({ createListFormik }: { createListFormik: any }) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (
      tagInput.trim() &&
      !createListFormik.values.tags.includes(tagInput.trim())
    ) {
      const newTags = [...createListFormik.values.tags, tagInput.trim()];
      createListFormik.setFieldValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = createListFormik.values.tags.filter(
      (tag: any) => tag !== tagToRemove
    );
    createListFormik.setFieldValue("tags", newTags);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Add a tag..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <button
            type="button"
            onClick={addTag}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Add
          </button>
        </div>
        {createListFormik.values.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {createListFormik.values.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;

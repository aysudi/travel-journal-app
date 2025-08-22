import { ArrowRight } from "lucide-react";
import CoverImage from "./CoverImage";
import Tags from "./Tags";
import Visibility from "./Visibility";

const ListDetails = ({ createListFormik }: { createListFormik: any }) => {
  return (
    <form onSubmit={createListFormik.handleSubmit} className="p-8">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            List Title *
          </label>
          <input
            type="text"
            name="title"
            value={createListFormik.values.title}
            onChange={createListFormik.handleChange}
            onBlur={createListFormik.handleBlur}
            placeholder="My Amazing Travel List"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={createListFormik.values.description}
            onChange={createListFormik.handleChange}
            onBlur={createListFormik.handleBlur}
            placeholder="Tell us about this travel list..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Tags */}
        <Tags createListFormik={createListFormik} />

        {/* Visibility */}
        <Visibility createListFormik={createListFormik} />

        {/* Cover Image */}
        <CoverImage createListFormik={createListFormik} />

        {/* Next Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={
              !createListFormik.values.title.trim() ||
              !createListFormik.values.coverImage
            }
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Next: Add Destinations
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ListDetails;

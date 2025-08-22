import { Globe, Lock, Users } from "lucide-react";

const Visibility = ({ createListFormik }: { createListFormik: any }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Visibility
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            createListFormik.setFieldValue("visibility", "private");
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            createListFormik.values.visibility === "private"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <Lock size={24} className="mx-auto mb-2" />
          <div className="font-medium">Private</div>
          <div className="text-sm opacity-75">Only you can see</div>
        </button>
        <button
          type="button"
          onClick={() => {
            createListFormik.setFieldValue("visibility", "friends");
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            createListFormik.values.visibility === "friends"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <Users size={24} className="mx-auto mb-2" />
          <div className="font-medium">Friends</div>
          <div className="text-sm opacity-75">Your friends can see</div>
        </button>
        <button
          type="button"
          onClick={() => {
            createListFormik.setFieldValue("visibility", "public");
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            createListFormik.values.visibility === "public"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <Globe size={24} className="mx-auto mb-2" />
          <div className="font-medium">Public</div>
          <div className="text-sm opacity-75">Everyone can see</div>
        </button>
      </div>
    </div>
  );
};

export default Visibility;

import { Plus, MapPin } from "lucide-react";

const EmptyLists = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            Travel Lists
          </h1>
          <p className="text-slate-600 text-lg">
            Create and manage your dream destinations
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No travel lists yet
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Start planning your next adventure by creating your first travel
            list
          </p>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto">
            <Plus size={20} />
            Create Your First List
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyLists;

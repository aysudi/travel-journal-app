import { BookOpen, Search } from "lucide-react";

const EmptyState = ({
  searchQuery,
  isMyJournals = false,
}: {
  searchQuery: string;
  isMyJournals?: boolean;
}) => (
  <div className="text-center py-16">
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <BookOpen size={40} className="text-indigo-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {searchQuery
          ? "No stories found"
          : isMyJournals
          ? "No journals yet"
          : "No public stories yet"}
      </h3>

      <p className="text-gray-600 mb-8 leading-relaxed">
        {searchQuery
          ? `We couldn't find any stories matching "${searchQuery}". Try adjusting your search terms.`
          : isMyJournals
          ? "Start documenting your travel adventures! Create your first journal entry to share your experiences."
          : "Be the first to share your amazing travel experiences with the world!"}
      </p>

      {searchQuery && (
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Search size={18} />
          Clear Search
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;

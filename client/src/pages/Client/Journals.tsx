import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Heart,
  MessageSquare,
  Share2,
  BookOpen,
  Globe,
  Sparkles,
  TrendingUp,
  Eye,
  MoreVertical,
  Camera,
} from "lucide-react";
import { usePublicJournalEntries } from "../../hooks/useEntries";
import Loading from "../../components/Common/Loading";
import type { JournalEntry } from "../../types/api";

const Journals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "trending" | "recent"
  >("all");
  const [page] = useState(1);
  const [cachedJournals, setCachedJournals] = useState<JournalEntry[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: journals,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = usePublicJournalEntries({
    page: 1,
    limit: 50,
  });

  const journalsArray = useMemo(() => {
    if (!journals) {
      return cachedJournals;
    }

    if (
      journals.data &&
      Array.isArray(journals.data) &&
      journals.data.length > 0
    ) {
      setCachedJournals(journals.data);
      return journals.data;
    }

    if (Array.isArray(journals) && journals.length > 0) {
      setCachedJournals(journals);
      return journals;
    }

    return cachedJournals;
  }, [journals, cachedJournals]);

  useEffect(() => {
    if (
      isSuccess &&
      journals?.data &&
      Array.isArray(journals.data) &&
      journals.data.length > 0
    ) {
      setCachedJournals(journals.data);
    }
  }, [isSuccess, journals]);

  const filteredJournals = journalsArray.filter((journal: JournalEntry) => {
    const matchesSearch =
      journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.author.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortedJournals = [...filteredJournals].sort(
    (a: JournalEntry, b: JournalEntry) => {
      switch (selectedFilter) {
        case "trending":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    }
  );

  if (isLoading && page === 1) {
    return <Loading variant="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-medium">Failed to load journals</p>
            <p className="text-sm mt-1">Please try again later.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Title and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Travel Journals
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <Globe size={20} className="text-indigo-500" />
                Discover amazing travel stories from around the world
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {journalsArray.length}
                </div>
                <div className="text-sm text-gray-600">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {
                    new Set(
                      journalsArray.map((j: JournalEntry) => j.author._id)
                    ).size
                  }
                </div>
                <div className="text-sm text-gray-600">Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {journalsArray.reduce(
                    (acc: number, j: JournalEntry) => acc + j.photos.length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search stories, authors, destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === "all"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white/70 text-gray-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <BookOpen size={16} />
                  <span>All</span>
                </button>
                <button
                  onClick={() => setSelectedFilter("trending")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === "trending"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white/70 text-gray-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <TrendingUp size={16} />
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => setSelectedFilter("recent")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === "recent"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white/70 text-gray-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <Sparkles size={16} />
                  <span>Recent</span>
                </button>
              </div>
            </div>

            {/* Active Filter Info */}
            {searchQuery && (
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-sm text-gray-600">
                  Found{" "}
                  <span className="font-semibold text-indigo-600">
                    {sortedJournals.length}
                  </span>{" "}
                  stories
                  {searchQuery && (
                    <>
                      {" "}
                      matching "
                      <span className="font-medium">{searchQuery}</span>"
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Journals Feed */}
        {sortedJournals.length > 0 ? (
          <>
            <div className="max-w-2xl mx-auto space-y-6">
              {sortedJournals.map((journal: JournalEntry, idx: number) => (
                <JournalCard key={idx} journal={journal} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div
              ref={loadMoreRef}
              className="h-20 flex items-center justify-center mt-8"
            >
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  Loading more stories...
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};

// Journal Card Component
const JournalCard = ({ journal }: { journal: JournalEntry }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
      {/* Header - Author Info */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            {journal.author.profileImage ? (
              <img
                src={journal.author.profileImage}
                alt={journal.author.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-indigo-100">
                <span className="text-white font-semibold text-sm">
                  {journal.author.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>

          <div>
            <p className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
              {journal.author.fullName}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>@{journal.author.username}</span>
              <span>•</span>
              <span>{formatTimeAgo(journal.createdAt)}</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Title and Content */}
      <div className="px-4 pb-3">
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors cursor-pointer">
          {journal.title}
        </h2>
        <div className="text-gray-700 leading-relaxed">
          <p className={showFullContent ? "" : "line-clamp-3"}>
            {journal.content}
          </p>
          {journal.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-indigo-600 hover:text-indigo-700 font-medium mt-1 text-sm transition-colors duration-200"
            >
              {showFullContent ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {journal.photos.length > 0 && (
        <div className="px-4 pb-3">
          {journal.photos.length === 1 ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={journal.photos[0]}
                alt={journal.title}
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />1
              </div>
            </div>
          ) : journal.photos.length === 2 ? (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {journal.photos.slice(0, 2).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`${journal.title} ${index + 1}`}
                    className="w-full h-60 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />
                {journal.photos.length}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
              {journal.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`${journal.title} ${index + 1}`}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {index === 2 && journal.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{journal.photos.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Camera size={12} />
                {journal.photos.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {journal.tags && journal.tags.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {journal.tags.slice(0, 4).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {journal.tags.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{journal.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
              isLiked
                ? "text-red-500 bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                isLiked ? "fill-current" : ""
              }`}
            />
            <span className="text-sm font-medium">0</span>
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200">
            <MessageSquare size={18} />
            <span className="text-sm font-medium">0</span>
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200">
            <Share2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Eye size={16} />
          <span>42 views</span>
        </div>
      </div>
    </article>
  );
};

// Empty State Component
const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="text-center py-16">
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <BookOpen size={40} className="text-indigo-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {searchQuery ? "No stories found" : "No public stories yet"}
      </h3>

      <p className="text-gray-600 mb-8 leading-relaxed">
        {searchQuery
          ? `We couldn't find any stories matching "${searchQuery}". Try adjusting your search terms.`
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

export default Journals;

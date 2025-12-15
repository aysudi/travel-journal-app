import { useState, useRef, useMemo } from "react";
import {
  Search,
  BookOpen,
  Globe,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import {
  usePublicJournalEntries,
  useJournalEntriesByAuthor,
} from "../../hooks/useEntries";
import { useUserProfile } from "../../hooks/useAuth";
import Loading from "../../components/Common/Loading";
import type { JournalEntry, JournalEntryCard } from "../../types/api";
import JournalCard from "../../components/Client/Journals/JournalCard";
import EmptyState from "../../components/Client/Journals/EmptyState";

const Journals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "trending" | "recent"
  >("all");
  const [journalType, setJournalType] = useState<"all" | "my">("all");
  const [page] = useState(1);
  const [cachedJournals, setCachedJournals] = useState<JournalEntry[]>([]);
  const [cachedMyJournals, setCachedMyJournals] = useState<JournalEntry[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: user } = useUserProfile();

  const {
    data: journals,
    isLoading: isLoadingPublic,
    error: errorPublic,
    refetch: refetchPublic,
  } = usePublicJournalEntries({
    page: 1,
    limit: 50,
  });

  const {
    data: myJournals,
    isLoading: isLoadingMy,
    error: errorMy,
    refetch: refetchMy,
  } = useJournalEntriesByAuthor(user?.id || "");

  const journalsArray = useMemo(() => {
    if (journalType === "my") {
      if (!myJournals) {
        return cachedMyJournals;
      }

      if (
        myJournals.data &&
        Array.isArray(myJournals.data) &&
        myJournals.data.length > 0
      ) {
        setCachedMyJournals(myJournals.data);
        return myJournals.data;
      }

      if (Array.isArray(myJournals) && myJournals.length > 0) {
        setCachedMyJournals(myJournals);
        return myJournals;
      }

      return cachedMyJournals;
    } else {
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
    }
  }, [journals, myJournals, cachedJournals, cachedMyJournals, journalType]);

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
            (b.likes?.length || 0) - (a.likes?.length || 0) ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "all":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    }
  );

  const displayJournals =
    journalType === "my"
      ? sortedJournals
      : sortedJournals.filter((journal: any) => journal.public === true);

  const isLoading = journalType === "all" ? isLoadingPublic : isLoadingMy;
  const error = journalType === "all" ? errorPublic : errorMy;
  const refetch = journalType === "all" ? refetchPublic : refetchMy;

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

            {/* Journal Type Tabs */}
            {user && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1 mt-8">
                <button
                  onClick={() => setJournalType("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    journalType === "all"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Globe size={16} />
                  All Journals
                </button>
                <button
                  onClick={() => setJournalType("my")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    journalType === "my"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <User size={16} />
                  My Journals
                </button>
              </div>
            )}

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
                      journalsArray.map((j: JournalEntry) => {
                        return j.author?._id;
                      })
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
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
                    {displayJournals.length}
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
        {displayJournals.length > 0 ? (
          <>
            <div className="max-w-2xl mx-auto space-y-6">
              {displayJournals.map((journal: JournalEntryCard, idx: number) => (
                <JournalCard
                  key={idx}
                  journal={journal}
                  showPrivacyIndicator={journalType === "my"}
                />
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
          <EmptyState
            searchQuery={searchQuery}
            isMyJournals={journalType === "my"}
          />
        )}
      </div>
    </div>
  );
};

export default Journals;

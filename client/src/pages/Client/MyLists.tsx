import { useState, useMemo } from "react";
import { Filter, Plus, MapPin, Grid3X3, List as ListIcon } from "lucide-react";
import { useOwnedTravelLists } from "../../hooks/useTravelList";
import TravelListCard from "../../components/Client/Lists/TravelListCard";
import SearchLists from "../../components/Client/Lists/SearchLists";
import FilterLists from "../../components/Client/Lists/FilterLists";
import SortLists from "../../components/Client/Lists/SortLists";
import Loading from "../../components/Common/Loading";
import EmptyLists from "../../components/Client/Lists/EmptyLists";
import type { SortOption, SortOrder } from "../../types/sortType";
import { Link } from "react-router";
import TravelListRow from "../../components/Client/Lists/TravelListRow";

type ViewMode = "grid" | "list";

const MyLists = () => {
  const { data: lists, isLoading, isError, error } = useOwnedTravelLists();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedLists = useMemo(() => {
    if (!lists) return [];

    let filtered = [...lists];

    if (searchQuery) {
      filtered = filtered.filter(
        (list) =>
          list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((list) =>
        selectedTags.some((tag) => list.tags.includes(tag))
      );
    }

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "destinations":
          aValue = a.destinations.length;
          bValue = b.destinations.length;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "updatedAt":
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [lists, searchQuery, sortBy, sortOrder, selectedTags]);

  if (isLoading) {
    return <Loading variant="page" message="Loading your travel lists" />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {error?.message ||
                  "We couldn't load your travel lists right now. Please try again in a moment."}
              </p>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lists || lists.length === 0) {
    return <EmptyLists />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              My Travel Lists
            </h1>
            <p className="text-slate-600 text-lg">
              Create, organize, and plan your adventures
            </p>
          </div>
          <Link
            to={`/create-list`}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4 lg:mt-0 cursor-pointer"
          >
            <Plus size={20} />
            Create New List
          </Link>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <SearchLists
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-blue-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-blue-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ListIcon size={18} />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  showFilters
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Filter size={18} />
                Filters
              </button>

              {/* Sort Button */}
              <SortLists
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <FilterLists
              lists={lists}
              setSelectedTags={setSelectedTags}
              selectedTags={selectedTags}
            />
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-slate-600">
              Showing {filteredAndSortedLists.length} of {lists?.length || 0}{" "}
              your travel lists
            </p>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Filtered by:</span>
                <div className="flex gap-1">
                  {selectedTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {selectedTags.length > 3 && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                      +{selectedTags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lists Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedLists.map((list, idx) => {
              return <TravelListCard key={idx} list={list} />;
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedLists.map((list, idx) => {
              return <TravelListRow key={idx} list={list} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLists;

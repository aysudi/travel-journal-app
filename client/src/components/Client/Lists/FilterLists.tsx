import { useMemo } from "react";

type TravelList = {
  tags: string[];
  [key: string]: any;
};

type FilterListsProps = {
  lists: TravelList[] | { data: TravelList[] } | null | undefined;
  setSelectedTags: (tags: string[] | ((prev: string[]) => string[])) => void;
  selectedTags: string[];
};

const FilterLists = ({
  lists,
  setSelectedTags,
  selectedTags,
}: FilterListsProps) => {
  const allTags = useMemo(() => {
    if (!lists) return [];
    const listData = Array.isArray(lists) ? lists : lists.data || [];
    const tagSet = new Set<string>();
    listData.forEach((list: TravelList) => {
      list.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [lists]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-700">Filter by Tags</h4>
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              #{tag}
            </button>
          ))}
          {allTags.length === 0 && (
            <p className="text-slate-500 text-sm italic">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterLists;

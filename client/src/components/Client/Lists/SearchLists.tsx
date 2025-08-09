import { Search } from "lucide-react";

type SearchListsProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchLists = ({ searchQuery, setSearchQuery }: SearchListsProps) => {
  return (
    <div className="flex-1 relative">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search lists by title, description, or tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
};

export default SearchLists;

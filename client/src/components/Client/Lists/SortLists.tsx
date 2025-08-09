import { SortDesc } from "lucide-react";
import type { SortOption, SortOrder } from "../../../types/sortType";

type SortListsProps = {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
};

const SortLists = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SortListsProps) => {
  return (
    <div className="relative">
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const [sort, order] = e.target.value.split("-");
          setSortBy(sort as SortOption);
          setSortOrder(order as SortOrder);
        }}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="updatedAt-desc">Latest Updated</option>
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="destinations-desc">Most Destinations</option>
        <option value="destinations-asc">Least Destinations</option>
      </select>
      <SortDesc
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400"
        size={16}
      />
    </div>
  );
};

export default SortLists;

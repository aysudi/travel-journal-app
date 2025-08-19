import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, TrendingUp } from "lucide-react";

interface Props {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

const GIPHY_API_KEY =
  import.meta.env.VITE_GIPHY_API_KEY || "GlVGYHkr3WSBnllca02iQj0Y8nsaGFr5";
const gf = new GiphyFetch(GIPHY_API_KEY);

export default function GifPicker({ onSelect, onClose }: Props) {
  const [visible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchGifs = (offset: number) => {
    if (searchQuery.trim()) {
      return gf.search(searchQuery, { offset, limit: 20 });
    }
    return gf.trending({ offset, limit: 20 });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return visible
    ? createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {searchQuery ? "Search Results" : "Trending GIFs"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/80 rounded-full transition-colors"
                aria-label="Close GIF picker"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for GIFs..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* GIF Grid */}
            <div className="flex-1 overflow-hidden relative">
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500">Searching for GIFs...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <Grid
                    width={
                      window.innerWidth > 768 ? 600 : window.innerWidth - 32
                    }
                    columns={window.innerWidth > 768 ? 3 : 2}
                    gutter={8}
                    fetchGifs={fetchGifs}
                    onGifClick={(gif, e) => {
                      e.preventDefault();
                      onSelect(gif.images.fixed_height.url);
                      handleClose();
                    }}
                    key={searchQuery}
                    className="p-4"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Powered by Giphy • Click any GIF to send
              </p>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}

import { Globe, Lock } from "lucide-react";
import formatDate, { formatDateInHours } from "../../../utils/formatDate";
import ActionButtons from "./ActionButtons";
import JournalImages from "./JournalImages";
import type { JournalEntry } from "../../../services";
import { Link } from "react-router";

type Props = {
  journal: JournalEntry;
  listId: string | undefined;
  onDelete?: (id: string) => void;
};

const JournalsTabs = ({ journal, listId, onDelete }: Props) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Destination Info */}
        {journal.destination && (
          <div className="mb-4 flex items-center gap-2 text-sm text-indigo-700 font-medium">
            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {typeof journal.destination === "object" &&
              journal.destination !== null ? (
                <>
                  <span>{(journal.destination as any).name}</span>
                  {(journal.destination as any).location && (
                    <span className="text-gray-500">{`(${
                      (journal.destination as any).location
                    })`}</span>
                  )}
                </>
              ) : (
                <span>Destination</span>
              )}
            </span>
          </div>
        )}
        {/* Author Info with enhanced design */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            <div className="relative">
              {journal.author.profileImage ? (
                <img
                  src={journal.author.profileImage}
                  alt={journal.author.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ring-2 ring-white shadow-lg">
                  <span className="text-white font-semibold text-lg">
                    {journal.author.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col">
              <p className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
                {journal.author.fullName}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  @{journal.author.username}
                </p>
                <span className="text-gray-300">•</span>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    journal.public
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {journal.public ? (
                    <>
                      <Globe size={10} />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock size={10} />
                      <span>Private</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Date with improved formatting */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">
              {formatDate(journal.createdAt)}
            </p>
            <p className="text-xs text-gray-400">
              {formatDateInHours(journal.createdAt)}
            </p>
          </div>
        </div>

        {/* Journal Content with enhanced design */}
        <div className="mb-6">
          <Link
            to={`/journals/${journal.id}`}
            className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
          >
            {journal.title}
          </Link>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-base line-clamp-4">
              {journal.content}
            </p>
          </div>

          {/* Read more button for long content */}
          {journal.content.length > 200 && (
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 transition-colors duration-200">
              Read more
            </button>
          )}
        </div>

        {/* Tags with improved styling */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {journal.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Journal Images with enhanced gallery */}
        {journal.photos.length > 0 && <JournalImages journal={journal} />}

        {/* Actions with enhanced design */}
        <ActionButtons listId={listId} journal={journal} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default JournalsTabs;

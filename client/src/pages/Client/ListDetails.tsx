import { useState, useRef } from "react";
import { useParams } from "react-router";
import {
  MapPin,
  Calendar,
  Camera,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Users,
  BookOpen,
  Globe,
  Lock,
  Heart,
  MessageSquare,
  Filter,
  SortAsc,
  MoreVertical,
  UserCheck,
} from "lucide-react";
import { useTravelList } from "../../hooks/useTravelList";
import Loading from "../../components/Common/Loading";

interface Destination {
  _id: string;
  name: string;
  location: string;
  status: "Wishlist" | "Planned" | "Visited";
  datePlanned?: string;
  dateVisited?: string;
  notes?: string;
  images: string[];
  list: string;
  createdAt: string;
}

interface Journal {
  _id: string;
  title: string;
  content: string;
  photos: string[];
  destination: string;
  author: {
    fullName: string;
    username: string;
    profileImage: string;
  };
  createdAt: string;
}

const ListDetails = () => {
  const { listId } = useParams<{ listId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    "destinations" | "journals" | "photos"
  >("destinations");
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDestinationDetail, setShowDestinationDetail] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Wishlist" | "Planned" | "Visited"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest"
  );

  const { data: travelList, isLoading, error } = useTravelList(listId || "");

  // Mock data for destinations and journals (replace with actual API calls)
  const destinations: Destination[] = [
    {
      _id: "1",
      name: "Eiffel Tower",
      location: "Paris, France",
      status: "Visited",
      dateVisited: "2024-06-15",
      notes:
        "Amazing sunset views from the top! Don't forget to book tickets in advance.",
      images: [
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
      ],
      list: listId || "",
      createdAt: "2024-06-01T10:00:00Z",
    },
    {
      _id: "2",
      name: "Santorini",
      location: "Greece",
      status: "Planned",
      datePlanned: "2024-08-20",
      notes: "Perfect for sunset photography. Book accommodation in Oia.",
      images: [
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
      ],
      list: listId || "",
      createdAt: "2024-05-15T14:30:00Z",
    },
    {
      _id: "3",
      name: "Tokyo",
      location: "Japan",
      status: "Wishlist",
      notes: "Experience cherry blossom season and try authentic sushi.",
      images: [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      ],
      list: listId || "",
      createdAt: "2024-05-01T09:15:00Z",
    },
  ];

  const journals: Journal[] = [
    {
      _id: "1",
      title: "A Magical Evening at the Eiffel Tower",
      content:
        "The golden hour at the Eiffel Tower was absolutely breathtaking...",
      photos: [
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
      ],
      destination: "1",
      author: {
        fullName: "Sarah Johnson",
        username: "sarahj",
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      },
      createdAt: "2024-06-16T18:00:00Z",
    },
  ];

  if (isLoading) {
    return <Loading variant="page" />;
  }

  if (error || !travelList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-medium">Travel list not found</p>
            <p className="text-sm mt-1">
              The list you're looking for doesn't exist or you don't have access
              to it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredDestinations = destinations.filter((dest) => {
    if (filterStatus === "all") return true;
    return dest.status === filterStatus;
  });

  const sortedDestinations = filteredDestinations.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Visited":
        return "bg-green-100 text-green-800";
      case "Planned":
        return "bg-blue-100 text-blue-800";
      case "Wishlist":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCoverImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file);
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowDestinationDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Cover Image Section */}
      <div className="relative h-80 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        {travelList?.coverImage ? (
          <img
            src={travelList.coverImage}
            alt={travelList.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Cover Image Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleCoverImageUpload}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            <Camera size={20} />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
            <Share2 size={20} />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* List Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            {travelList?.visibility === "public" ? (
              <Globe size={16} className="text-white/80" />
            ) : travelList?.visibility === "friends" ? (
              <UserCheck size={16} className="text-white/80" />
            ) : (
              <Lock size={16} className="text-white/80" />
            )}
            <span className="text-white/80 text-sm capitalize">
              {travelList?.visibility || "Private"} List
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {travelList?.title}
          </h1>
          {travelList?.description && (
            <p className="text-white/90 text-lg max-w-2xl">
              {travelList.description}
            </p>
          )}

          {/* Tags */}
          {travelList?.tags && travelList.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {travelList.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {destinations.length}
                </div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {journals.length}
                </div>
                <div className="text-sm text-gray-600">Journals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {destinations.filter((d) => d.status === "Visited").length}
                </div>
                <div className="text-sm text-gray-600">Visited</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Only show invite button for private lists */}
              {travelList?.visibility === "private" && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Users size={18} />
                  <span>Invite</span>
                </button>
              )}
              <button
                onClick={() => setShowAddDestination(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus size={18} />
                <span>Add Destination</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("destinations")}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "destinations"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <MapPin size={18} />
                  <span>Destinations ({destinations.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("journals")}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "journals"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <BookOpen size={18} />
                  <span>Journals ({journals.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "photos"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <Camera size={18} />
                  <span>Photos</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Destinations Tab */}
            {activeTab === "destinations" && (
              <div>
                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="Wishlist">Wishlist</option>
                        <option value="Planned">Planned</option>
                        <option value="Visited">Visited</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <SortAsc size={16} className="text-gray-500" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Showing {sortedDestinations.length} destinations
                  </div>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedDestinations.map((destination) => (
                    <div
                      key={destination._id}
                      onClick={() => handleDestinationClick(destination)}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      {/* Destination Image */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {destination.images[0] ? (
                          <img
                            src={destination.images[0]}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <MapPin size={48} className="text-indigo-400" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              destination.status
                            )}`}
                          >
                            {destination.status}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex gap-2">
                            <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer">
                              <Edit3 size={14} />
                            </button>
                            <button className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Destination Info */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                          {destination.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                          <MapPin size={16} />
                          <span className="text-sm">
                            {destination.location}
                          </span>
                        </div>

                        {/* Date Info */}
                        {(destination.datePlanned ||
                          destination.dateVisited) && (
                          <div className="flex items-center gap-1 text-gray-600 mb-3">
                            <Calendar size={16} />
                            <span className="text-sm">
                              {destination.dateVisited
                                ? `Visited ${new Date(
                                    destination.dateVisited
                                  ).toLocaleDateString()}`
                                : `Planned ${new Date(
                                    destination.datePlanned!
                                  ).toLocaleDateString()}`}
                            </span>
                          </div>
                        )}

                        {/* Notes Preview */}
                        {destination.notes && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {destination.notes}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors duration-200">
                            <BookOpen size={16} />
                            <span>Add Journal</span>
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <Heart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {sortedDestinations.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No destinations found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {filterStatus === "all"
                        ? "Start building your travel list by adding your first destination"
                        : `No destinations with status "${filterStatus}"`}
                    </p>
                    <button
                      onClick={() => setShowAddDestination(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus size={20} />
                      <span>Add Your First Destination</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Journals Tab */}
            {activeTab === "journals" && (
              <div>
                <div className="space-y-6">
                  {journals.map((journal) => (
                    <div
                      key={journal._id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={journal.author.profileImage}
                            alt={journal.author.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {journal.author.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{journal.author.username}
                            </p>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">
                            {new Date(journal.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Journal Content */}
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {journal.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {journal.content}
                        </p>

                        {/* Journal Photos */}
                        {journal.photos.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            {journal.photos.slice(0, 4).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Journal photo ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                            <Heart size={18} />
                            <span className="text-sm">Like</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition-colors duration-200">
                            <MessageSquare size={18} />
                            <span className="text-sm">Comment</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            <Share2 size={18} />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State for Journals */}
                {journals.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen
                      size={64}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No journals yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start documenting your travel experiences by creating your
                      first journal entry
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Plus size={20} />
                      <span>Write Your First Journal</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div>
                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {destinations
                    .flatMap((d) => d.images)
                    .concat(journals.flatMap((j) => j.photos))
                    .map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>

                {/* Empty State for Photos */}
                {destinations
                  .flatMap((d) => d.images)
                  .concat(journals.flatMap((j) => j.photos)).length === 0 && (
                  <div className="text-center py-12">
                    <Camera size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No photos yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add photos to your destinations and journals to see them
                      here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Add Destination Modal */}
      {showAddDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Destination</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Eiffel Tower"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Paris, France"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Wishlist">Wishlist</option>
                  <option value="Planned">Planned</option>
                  <option value="Visited">Visited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Add any notes about this destination..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDestination(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
                >
                  Add Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-2">
              Invite Users to Private List
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Give others access to your private travel list and set their
              permission level.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email or username to invite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="view">
                    View Only - Can view destinations and journals
                  </option>
                  <option value="suggest">
                    Suggest - Can suggest destinations
                  </option>
                  <option value="contribute">
                    Contribute - Can add destinations and journals
                  </option>
                  <option value="co-owner">
                    Co-owner - Full access except deletion
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Add a personal message to your invitation..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer">
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Destination Detail Modal */}
      {showDestinationDetail && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gray-200 overflow-hidden">
              {selectedDestination.images[0] ? (
                <img
                  src={selectedDestination.images[0]}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <MapPin size={64} className="text-indigo-400" />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDestinationDetail(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors duration-200 cursor-pointer"
              >
                ×
              </button>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    selectedDestination.status
                  )}`}
                >
                  {selectedDestination.status}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedDestination.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{selectedDestination.location}</span>
                </div>

                {/* Date Info */}
                {(selectedDestination.datePlanned ||
                  selectedDestination.dateVisited) && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar size={18} />
                    <span>
                      {selectedDestination.dateVisited
                        ? `Visited on ${new Date(
                            selectedDestination.dateVisited
                          ).toLocaleDateString()}`
                        : `Planned for ${new Date(
                            selectedDestination.datePlanned!
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {selectedDestination.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedDestination.notes}
                    </p>
                  </div>
                )}

                {/* Images Gallery */}
                {selectedDestination.images.length > 1 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedDestination.images
                        .slice(1)
                        .map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedDestination.name} photo ${
                              index + 2
                            }`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <Edit3 size={18} />
                  <span>Edit</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <BookOpen size={18} />
                  <span>Add Journal</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <Camera size={18} />
                  <span>Add Photos</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-auto cursor-pointer">
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetails;

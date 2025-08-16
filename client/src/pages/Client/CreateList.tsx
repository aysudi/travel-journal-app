import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Globe,
  Users,
  Lock,
  Calendar,
  Image,
  Plus,
  X,
  Upload,
  Tag,
  List,
} from "lucide-react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import createListValidation from "../../validations/createListValidation";
import { travelListService, destinationService } from "../../services";
import type { CreateTravelListData, TravelList } from "../../types/api";

interface DestinationFormData {
  name: string;
  location: string;
  status: "wishlist" | "planned" | "visited";
  datePlanned?: string;
  dateVisited?: string;
  notes: string;
  images: File[];
}

const CreateList = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<"list" | "destination">(
    "list"
  );
  const [destinations, setDestinations] = useState<DestinationFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentDestination, setCurrentDestination] =
    useState<DestinationFormData>({
      name: "",
      location: "",
      status: "wishlist",
      datePlanned: "",
      dateVisited: "",
      notes: "",
      images: [],
    });

  const createTravelListWithImage = async (
    listData: CreateTravelListData,
    coverImage: File | null
  ): Promise<TravelList> => {
    const formData = new FormData();

    formData.append("title", listData.title);
    if (listData.description) {
      formData.append("description", listData.description);
    }
    if (listData.tags && listData.tags.length > 0) {
      formData.append("tags", JSON.stringify(listData.tags));
    }
    if (listData.visibility !== undefined) {
      formData.append("visibility", listData.visibility);
    }

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    return travelListService.createTravelListWithFormData(formData);
  };

  const createDestinations = async (travelListId: string) => {
    const createdDestinations = [];

    for (const dest of destinations) {
      try {
        const formData = new FormData();
        formData.append("name", dest.name);
        formData.append("location", dest.location);
        if (dest.notes) formData.append("notes", dest.notes);
        formData.append(
          "status",
          dest.status === "visited"
            ? "Visited"
            : dest.status === "planned"
            ? "Planned"
            : "Wishlist"
        );
        if (dest.status === "visited" && dest.dateVisited) {
          formData.append(
            "dateVisited",
            new Date(dest.dateVisited).toISOString()
          );
        }
        if (dest.status === "planned" && dest.datePlanned) {
          formData.append(
            "datePlanned",
            new Date(dest.datePlanned).toISOString()
          );
        }
        formData.append("list", travelListId);
        if (dest.images && dest.images.length > 0) {
          dest.images.forEach((file) => {
            formData.append("images", file);
          });
        }

        const createdDestination = await destinationService.createDestination(
          formData
        );
        createdDestinations.push(createdDestination);
      } catch (error) {
        console.error(`Failed to create destination ${dest.name}:`, error);
        throw error;
      }
    }

    return createdDestinations;
  };

  const [tagInput, setTagInput] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [destinationImagePreviews, setDestinationImagePreviews] = useState<
    string[]
  >([]);

  const createListFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [] as string[],
      visibility: "",
      coverImage: null as File | null,
    },
    onSubmit: async (values) => {
      if (currentStep === "list") {
        if (values.title.trim() && values.coverImage) {
          setCurrentStep("destination");
        }
        return;
      }

      try {
        setIsSubmitting(true);

        const travelListData = {
          title: values.title,
          description: values.description || "",
          tags: values.tags.length > 0 ? values.tags : [],
          visibility: values.visibility,
        };

        const createdList = await createTravelListWithImage(
          travelListData,
          values.coverImage
        );

        if (destinations.length > 0) {
          await createDestinations(createdList.id);
        }

        console.log(createdList);

        enqueueSnackbar("Travel list created successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });

        navigate(`/lists/${createdList.id}`);
      } catch (error) {
        console.error("Failed to create travel list:", error);
        enqueueSnackbar("Failed to create travel list. Please try again.", {
          variant: "error",
          autoHideDuration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: createListValidation,
  });

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      createListFormik.setFieldValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDestinationImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCurrentDestination({
        ...currentDestination,
        images: [...currentDestination.images, ...files],
      });

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDestinationImagePreviews((prev) => [
            ...prev,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !createListFormik.values.tags.includes(tagInput.trim())
    ) {
      const newTags = [...createListFormik.values.tags, tagInput.trim()];
      createListFormik.setFieldValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = createListFormik.values.tags.filter(
      (tag) => tag !== tagToRemove
    );
    createListFormik.setFieldValue("tags", newTags);
  };

  const removeDestinationImage = (indexToRemove: number) => {
    setCurrentDestination({
      ...currentDestination,
      images: currentDestination.images.filter(
        (_, index) => index !== indexToRemove
      ),
    });
    setDestinationImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const addDestination = () => {
    if (currentDestination.name && currentDestination.location) {
      setDestinations([...destinations, currentDestination]);
      setCurrentDestination({
        name: "",
        location: "",
        status: "wishlist",
        datePlanned: "",
        dateVisited: "",
        notes: "",
        images: [],
      });
      setDestinationImagePreviews([]);
    }
  };

  const removeDestination = (indexToRemove: number) => {
    setDestinations(destinations.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Plus className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create New List
          </h1>
          <p className="text-gray-600">
            {currentStep === "list"
              ? "Start by adding your list details"
              : "Add destinations to your travel list"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                currentStep === "list"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-indigo-600 border border-indigo-200"
              }`}
            >
              <List size={18} />
              <span className="font-medium">List Details</span>
            </div>
            <ArrowRight
              size={20}
              className={`${
                currentStep === "destination"
                  ? "text-indigo-600"
                  : "text-gray-400"
              }`}
            />
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                currentStep === "destination"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-400 border border-gray-200"
              }`}
            >
              <MapPin size={18} />
              <span className="font-medium">Add Destinations</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep === "list" ? (
            /* List Details Step */
            <form onSubmit={createListFormik.handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={createListFormik.values.title}
                    onChange={createListFormik.handleChange}
                    onBlur={createListFormik.handleBlur}
                    placeholder="My Amazing Travel List"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={createListFormik.values.description}
                    onChange={createListFormik.handleChange}
                    onBlur={createListFormik.handleBlur}
                    placeholder="Tell us about this travel list..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                          placeholder="Add a tag..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                      >
                        Add
                      </button>
                    </div>
                    {createListFormik.values.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {createListFormik.values.tags.map(
                          (tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors duration-200"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        createListFormik.setFieldValue("visibility", "private");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        createListFormik.values.visibility === "private"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Lock size={24} className="mx-auto mb-2" />
                      <div className="font-medium">Private</div>
                      <div className="text-sm opacity-75">Only you can see</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        createListFormik.setFieldValue("visibility", "friends");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        createListFormik.values.visibility === "friends"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Users size={24} className="mx-auto mb-2" />
                      <div className="font-medium">Friends</div>
                      <div className="text-sm opacity-75">
                        Your friends can see
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        createListFormik.setFieldValue("visibility", "public");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        createListFormik.values.visibility === "public"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Globe size={24} className="mx-auto mb-2" />
                      <div className="font-medium">Public</div>
                      <div className="text-sm opacity-75">Everyone can see</div>
                    </button>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="cover-image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        <input
                          id="cover-image"
                          name="coverImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverImageUpload}
                        />
                      </label>
                    </div>
                    {coverImagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            createListFormik.setFieldValue("coverImage", null);
                            setCoverImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={
                      !createListFormik.values.title.trim() ||
                      !createListFormik.values.coverImage
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next: Add Destinations
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Destinations Step */
            <form onSubmit={createListFormik.handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Current Destinations */}
                {destinations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Added Destinations ({destinations.length})
                    </h3>
                    <div className="space-y-3">
                      {destinations.map((dest, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin
                              size={18}
                              className={`${
                                dest.status === "visited"
                                  ? "text-green-500"
                                  : dest.status === "planned"
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                            />
                            <div>
                              <div className="font-medium text-gray-800">
                                {dest.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {dest.location} • {dest.status}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDestination(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-1 transition-colors duration-200"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Destination Form */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add New Destination
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Name *
                      </label>
                      <input
                        type="text"
                        value={currentDestination.name}
                        onChange={(e) =>
                          setCurrentDestination({
                            ...currentDestination,
                            name: e.target.value,
                          })
                        }
                        placeholder="Paris, Tokyo, Bali..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={currentDestination.location}
                        onChange={(e) =>
                          setCurrentDestination({
                            ...currentDestination,
                            location: e.target.value,
                          })
                        }
                        placeholder="France, Japan, Indonesia..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                      />
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentDestination({
                              ...currentDestination,
                              status: "wishlist",
                            })
                          }
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            currentDestination.status === "wishlist"
                              ? "border-gray-500 bg-gray-50 text-gray-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">Wishlist</div>
                          <div className="text-sm opacity-75">
                            Want to visit
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentDestination({
                              ...currentDestination,
                              status: "planned",
                            })
                          }
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            currentDestination.status === "planned"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">Planned</div>
                          <div className="text-sm opacity-75">Trip booked</div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentDestination({
                              ...currentDestination,
                              status: "visited",
                            })
                          }
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            currentDestination.status === "visited"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">Visited</div>
                          <div className="text-sm opacity-75">Been there</div>
                        </button>
                      </div>
                    </div>

                    {/* Date fields based on status */}
                    {currentDestination.status === "planned" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar size={16} className="inline mr-1" />
                          Planned Date
                        </label>
                        <input
                          type="date"
                          value={currentDestination.datePlanned}
                          onChange={(e) =>
                            setCurrentDestination({
                              ...currentDestination,
                              datePlanned: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                        />
                      </div>
                    )}

                    {currentDestination.status === "visited" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar size={16} className="inline mr-1" />
                          Visit Date
                        </label>
                        <input
                          type="date"
                          value={currentDestination.dateVisited}
                          onChange={(e) =>
                            setCurrentDestination({
                              ...currentDestination,
                              dateVisited: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={currentDestination.notes}
                        onChange={(e) =>
                          setCurrentDestination({
                            ...currentDestination,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Any special notes about this destination..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                      />
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="destination-images"
                            className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <Image className="w-6 h-6 mb-1 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                Add photos (multiple allowed)
                              </p>
                            </div>
                            <input
                              id="destination-images"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleDestinationImagesUpload}
                            />
                          </label>
                        </div>
                        {destinationImagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {destinationImagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeDestinationImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Destination Button */}
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={addDestination}
                      disabled={
                        !currentDestination.name.trim() ||
                        !currentDestination.location.trim()
                      }
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Plus size={18} />
                      Add Destination
                    </button>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("list")}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    <ArrowLeft size={18} />
                    Back to List Details
                  </button>
                  <button
                    type="submit"
                    disabled={destinations.length === 0 || isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create List
                        <Plus size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateList;

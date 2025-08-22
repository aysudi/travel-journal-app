import { ArrowLeft, Plus } from "lucide-react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import createListValidation from "../../validations/createListValidation";
import { travelListService, destinationService } from "../../services";
import type {
  CreateTravelListData,
  DestinationFormData,
  TravelList,
} from "../../types/api";
import { useCreateChat } from "../../hooks/useChats";
import { useUserProfile } from "../../hooks/useAuth";
import { useState } from "react";
import AddDestination from "../../components/Client/CreateList/AddDestination";
import ProgressBar from "../../components/Client/CreateList/ProgressBar";
import ListDetails from "../../components/Client/CreateList/ListDetails";
import CurrentDestinations from "../../components/Client/CreateList/CurrentDestinations";

const CreateList = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<"list" | "destination">(
    "list"
  );
  const [destinations, setDestinations] = useState<DestinationFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createChat = useCreateChat();
  const { data: user } = useUserProfile();

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

        await createChat.mutateAsync({
          members: [user?.id],
          name: createdList.title,
          createdBy: user?.id,
          list: createdList.id,
        });

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
        <ProgressBar currentStep={currentStep} />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep === "list" ? (
            /* List Details Step */
            <ListDetails createListFormik={createListFormik} />
          ) : (
            /* Destinations Step */
            <form onSubmit={createListFormik.handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Current Destinations */}
                {destinations.length > 0 && (
                  <CurrentDestinations
                    setDestinations={setDestinations}
                    destinations={destinations}
                  />
                )}

                {/* Add New Destination Form */}
                <AddDestination
                  destinations={destinations}
                  setDestinations={setDestinations}
                />

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

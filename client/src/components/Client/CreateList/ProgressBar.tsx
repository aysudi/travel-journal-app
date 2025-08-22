import { ArrowRight, List, MapPin } from "lucide-react";

const ProgressBar = ({
  currentStep,
}: {
  currentStep: "list" | "destination";
}) => {
  return (
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
            currentStep === "destination" ? "text-indigo-600" : "text-gray-400"
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
  );
};

export default ProgressBar;

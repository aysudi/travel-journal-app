import {
  Crown,
  X,
  Zap,
  CheckCircle,
  Users,
  Camera,
  MapPin,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: "lists" | "destinations" | "journals" | "images" | "collaborators";
  currentUsage?: number;
  limit?: number;
}

const PremiumUpgradeModal = ({
  isOpen,
  onClose,
  feature,
  currentUsage = 0,
  limit = 0,
}: PremiumUpgradeModalProps) => {
  const navigate = useNavigate();

  const featureConfig = {
    lists: {
      icon: <FileText size={48} className="text-blue-500" />,
      title: "Travel List Limit Reached",
      description: `You've created ${currentUsage}/${limit} travel lists. Upgrade to Premium for unlimited lists!`,
      benefits: [
        "Unlimited travel lists",
        "Advanced list sharing options",
        "Priority support",
        "Exclusive features",
      ],
    },
    destinations: {
      icon: <MapPin size={48} className="text-green-500" />,
      title: "Destination Limit Reached",
      description: `You've added ${currentUsage}/${limit} destinations to this list. Premium users get unlimited destinations per list!`,
      benefits: [
        "Unlimited destinations per list",
        "Advanced destination details",
        "Priority recommendations",
        "Offline access",
      ],
    },
    journals: {
      icon: <FileText size={48} className="text-purple-500" />,
      title: "Journal Entry Limit Reached",
      description: `You've created ${currentUsage}/${limit} journal entries. Upgrade to Premium for unlimited journaling!`,
      benefits: [
        "Unlimited journal entries",
        "Advanced analytics",
        "Export capabilities",
        "Cloud sync",
      ],
    },
    images: {
      icon: <Camera size={48} className="text-pink-500" />,
      title: "Image Limit Reached",
      description: `Premium users can add up to 5 images per journal entry instead of just ${limit}!`,
      benefits: [
        "Up to 5 images per journal",
        "Higher quality uploads",
        "Unlimited storage",
        "Image editing tools",
      ],
    },
    collaborators: {
      icon: <Users size={48} className="text-indigo-500" />,
      title: "Collaborator Limit Reached",
      description: `You can add up to ${limit} collaborators per list. Premium users get unlimited collaborators!`,
      benefits: [
        "Unlimited collaborators",
        "Advanced permissions",
        "Team chat features",
        "Activity tracking",
      ],
    },
  };

  const config = featureConfig[feature];

  const handleUpgrade = () => {
    onClose();
    navigate("/premium/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:text-black hover:bg-opacity-20 rounded-full p-1 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="mb-4 flex justify-center">{config.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
            <p className="text-yellow-100 text-sm">{config.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current vs Premium */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {currentUsage}
                </div>
                <div className="text-xs text-gray-600">Current Usage</div>
              </div>
              <div className="text-center">
                <Zap size={24} className="text-yellow-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Upgrade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">∞</div>
                <div className="text-xs text-gray-600">With Premium</div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Crown size={20} className="text-yellow-500" />
              Premium Benefits
            </h3>
            <div className="space-y-3">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border-l-4 border-blue-400">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Starting at just $9.99/month
              </div>
              <div className="text-sm text-gray-600">
                Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown size={20} />
              Upgrade to Premium
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;

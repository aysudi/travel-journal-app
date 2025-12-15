import { Crown, CheckCircle, Sparkles, Gift, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpdateProfile, useUserProfile } from "../../hooks/useAuth";
import { useEffect } from "react";

const PremiumSuccess = () => {
  const { data: user, refetch } = useUserProfile();
  const updatePremium = useUpdateProfile();

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  const handleGoToProfile = async () => {
    if (user && !user.premium) {
      try {
        const formData = new FormData();
        formData.append("premium", "true");
        await updatePremium.mutateAsync(formData);
      } catch (error) {
        console.error("Failed to update premium status:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 -left-6 w-16 h-16 bg-orange-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 left-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-20"></div>
          </div>

          <div className="relative z-10">
            {/* Success Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown size={40} className="text-white animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                Congratulations!
                <Sparkles size={24} className="text-yellow-500" />
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Welcome to{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                  VoyageVault Premium
                </span>
              </p>
              <p className="text-sm text-gray-500">
                You now have access to exclusive premium features! 🎉
              </p>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <Gift size={20} className="text-yellow-500" />
                Your Premium Benefits
              </h3>
              <div className="space-y-3 text-left">
                {[
                  "Unlimited travel lists",
                  "Priority customer support",
                  "Advanced analytics & insights",
                  "Exclusive premium badges",
                  "Early access to new features",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <Star size={16} className="text-yellow-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Link
              to="/profile"
              onClick={handleGoToProfile}
              className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-600 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Crown size={20} />
              <span>Go to My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSuccess;

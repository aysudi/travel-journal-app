import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpdateProfile, useUserProfile } from "../../hooks/useAuth";

const PremiumSuccess = () => {
  const { data: user } = useUserProfile();
  const updatePremium = useUpdateProfile();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <Crown size={64} className="text-yellow-400 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          You are now a{" "}
          <span className="font-semibold text-yellow-500">Premium Member</span>{" "}
          🎉
        </p>
        <Link
          onClick={async () => {
            if (user) {
              const formData = new FormData();
              formData.append("premium", "true");
              await updatePremium.mutateAsync(formData);
            }
          }}
          to="/profile"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow hover:from-teal-600 hover:to-cyan-700 transition-all duration-200"
        >
          Go to My Profile
        </Link>
      </div>
    </div>
  );
};

export default PremiumSuccess;

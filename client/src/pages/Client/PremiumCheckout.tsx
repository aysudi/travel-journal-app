import { useState } from "react";
import {
  Crown,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "../../hooks/useAuth";
import Loading from "../../components/Common/Loading";

const PremiumCheckout = () => {
  const { data: user } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleSubscribe = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5050/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            lineItems: [
              {
                price: "dynamic", // Server will create appropriate price
                quantity: 1,
              },
            ],
            mode: "subscription",
            successUrl: window.location.origin + "/profile/success",
            cancelUrl: window.location.origin + "/premium/checkout",
            metadata: {
              userId: user.id,
              subscriptionType: paymentMethod,
            },
            customText: {
              submit: {
                message:
                  "Welcome to VoyageVault Premium! Your subscription will start immediately.",
              },
            },
            subscriptionData: {
              description: `VoyageVault Premium ${
                paymentMethod === "monthly" ? "Monthly" : "Yearly"
              } Subscription`,
            },
          }),
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout session response:", data);
        alert("Could not start checkout. Please try again.");
      }
    } catch (err) {
      console.error("Premium checkout error:", err);
      alert("Failed to start premium checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Loading variant="page" />;
  }

  const monthlyPrice = 9.99;
  const yearlyPrice = 99.99;
  const yearlySavings = (monthlyPrice * 12 - yearlyPrice).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Profile</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Upgrade to Premium
            </h1>
            <p className="text-gray-600">
              Unlock the full VoyageVault experience
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white text-center">
              <Crown size={48} className="mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-yellow-100">
                Select the perfect plan for your travel adventures
              </p>
            </div>

            <div className="p-8">
              {/* Plan Options */}
              <div className="space-y-4 mb-8">
                {/* Monthly Plan */}
                <div
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "monthly"
                      ? "border-yellow-400 bg-yellow-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("monthly")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "monthly"
                            ? "border-yellow-400"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "monthly" && (
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Monthly
                        </h3>
                        <p className="text-gray-600">Billed monthly</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        ${monthlyPrice}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 relative ${
                    paymentMethod === "yearly"
                      ? "border-green-400 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("yearly")}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Save ${yearlySavings}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "yearly"
                            ? "border-green-400"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "yearly" && (
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Yearly
                        </h3>
                        <p className="text-gray-600">Billed annually</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        ${yearlyPrice}
                      </div>
                      <div className="text-sm text-gray-500">per year</div>
                      <div className="text-xs text-green-600 font-semibold">
                        ${(yearlyPrice / 12).toFixed(2)}/month
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    Subscribe to Premium
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Secure payment processed by Stripe. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Sparkles size={48} className="mx-auto text-yellow-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Premium Features
              </h2>
              <p className="text-gray-600">
                Everything you need for the perfect travel experience
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Zap className="text-yellow-500" size={24} />,
                  title: "Unlimited Travel Lists",
                  description:
                    "Create as many travel lists as you want with no restrictions",
                },
                {
                  icon: <Shield className="text-blue-500" size={24} />,
                  title: "Priority Support",
                  description:
                    "Get help when you need it with our dedicated premium support",
                },
                {
                  icon: <CheckCircle className="text-green-500" size={24} />,
                  title: "Advanced Analytics",
                  description:
                    "Detailed insights about your travel patterns and achievements",
                },
                {
                  icon: <Crown className="text-purple-500" size={24} />,
                  title: "Exclusive Badges",
                  description:
                    "Show off your premium status with special profile badges",
                },
                {
                  icon: <Sparkles className="text-pink-500" size={24} />,
                  title: "Early Access",
                  description: "Be the first to try new features and updates",
                },
                {
                  icon: <CreditCard className="text-indigo-500" size={24} />,
                  title: "Ad-Free Experience",
                  description: "Enjoy VoyageVault without any advertisements",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-l-4 border-blue-400">
              <h3 className="font-semibold text-gray-800 mb-2">
                Money-Back Guarantee
              </h3>
              <p className="text-sm text-gray-600">
                Not satisfied? Cancel within 30 days for a full refund. No
                questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckout;

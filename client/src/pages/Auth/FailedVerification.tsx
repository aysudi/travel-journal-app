import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import instance from "../../services/axiosInstance";
import endpoints from "../../services/api";

const FailedVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      // No token means user accessed this page directly - redirect to login
      navigate("/auth/login");
    }
  }, [token, navigate]);

  const verifyEmailToken = async () => {
    try {
      setVerificationStatus("loading");

      const response = await instance.get(
        `${endpoints.users}/verify-email?token=${token}`
      );

      setVerificationStatus("success");
      setMessage(response.data.message || "Email verified successfully!");

      // Show success message
      enqueueSnackbar("Email verified successfully! Redirecting to login...", {
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (error: any) {
      console.error("Email verification error:", error);

      let errorMessage = "Email verification failed. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Check if token is expired
      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid")
      ) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("error");
      }

      setMessage(errorMessage);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "expired":
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "error":
      default:
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case "loading":
        return "Verifying Your Email";
      case "success":
        return "Email Verified!";
      case "expired":
        return "Link Expired";
      case "error":
      default:
        return "Verification Failed";
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case "loading":
        return "Please wait while we verify your email address...";
      case "success":
        return "Your email has been successfully verified. You can now access all features of VoyageVault.";
      case "expired":
        return "This verification link has expired. Please request a new verification email.";
      case "error":
      default:
        return "We couldn't verify your email address. Please try again or contact support.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {getStatusIcon()}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {getStatusTitle()}
          </h1>
          <p className="text-slate-600 max-w-sm mx-auto">
            {getStatusDescription()}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50">
          {/* Status Message */}
          <div className="text-center mb-6">
            <div
              className={`p-4 rounded-xl ${
                verificationStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : verificationStatus === "expired"
                  ? "bg-amber-50 border border-amber-200"
                  : verificationStatus === "loading"
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  verificationStatus === "success"
                    ? "text-green-800"
                    : verificationStatus === "expired"
                    ? "text-amber-800"
                    : verificationStatus === "loading"
                    ? "text-blue-800"
                    : "text-red-800"
                }`}
              >
                {message || getStatusDescription()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {verificationStatus === "success" && (
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue to Login
                </button>
                <Link
                  to="/dashboard"
                  className="block w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            {(verificationStatus === "expired" ||
              verificationStatus === "error") && (
              <div className="space-y-3">
                <Link
                  to="/auth/register"
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Create New Account
                </Link>
                <Link
                  to="/auth/login"
                  className="block w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
                >
                  Back to Login
                </Link>
              </div>
            )}

            {verificationStatus === "loading" && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing verification...
                </div>
              </div>
            )}
          </div>

          {/* Alternative Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">Having trouble?</p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Back to Login
                </Link>
                <span className="text-slate-300">•</span>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@voyagevault.com"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              support@voyagevault.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FailedVerification;

import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { enqueueSnackbar } from "notistack";
import { useResendVerification } from "../../hooks/useAuth";

const CheckEmail = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendVerificationMutation = useResendVerification();

  const email = searchParams.get("email");

  const handleResendVerification = () => {
    if (!email) {
      enqueueSnackbar("Cannot resend verification. Email address not found.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setIsResending(true);

    resendVerificationMutation.mutate(email, {
      onSuccess: () => {
        enqueueSnackbar("Verification email sent! Please check your inbox.", {
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "success",
        });

        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setIsResending(false);
      },
      onError: (error: any) => {
        console.error("Resend verification error:", error);

        let errorMessage =
          "Failed to resend verification email. Please try again.";

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        enqueueSnackbar(errorMessage, {
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
        setIsResending(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Check Your Email
          </h1>
          <p className="text-slate-600 max-w-sm mx-auto">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50">
          {/* Email Display */}
          {email && (
            <div className="text-center mb-6">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-slate-600 mb-1">Email sent to:</p>
                <p className="text-blue-800 font-medium">{email}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Next Steps:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Check your email inbox (and spam folder)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Click the verification link in the email
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <p className="text-slate-600 text-sm">
                  You'll be redirected back to VoyageVault to start your journey
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={
                isResending ||
                resendCooldown > 0 ||
                resendVerificationMutation.isPending
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isResending || resendVerificationMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Sending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend Verification Email"
              )}
            </button>

            <Link
              to="/auth/login"
              className="block w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
            >
              Back to Login
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">
                Didn't receive the email?
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait a few minutes for the email to arrive</li>
                <li>• Contact support if you still don't receive it</li>
              </ul>
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

export default CheckEmail;

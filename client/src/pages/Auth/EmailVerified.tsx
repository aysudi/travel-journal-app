import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { enqueueSnackbar } from "notistack";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, { variant: "success" });
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Email Verified!
          </h1>
          <p className="text-slate-600 max-w-sm mx-auto">
            Your email has been successfully verified. You can now access all
            features of VoyageVault.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50">
          {/* Success Message */}
          <div className="text-center mb-6">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-green-800 font-medium">
                Welcome to VoyageVault! Your account is now ready to use.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/auth/login"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center block"
            >
              Continue to Login
            </Link>
            <Link
              to="/auth/register"
              className="block w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
            >
              Create Another Account
            </Link>
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
}

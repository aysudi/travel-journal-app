import React from "react";
import { Loader2, MapPin, Plane } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "page" | "inline";
  showIcon?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "md",
  variant = "default",
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-blue-500`}
        />
        {message && (
          <span className="text-slate-600 font-medium text-sm">{message}</span>
        )}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          {/* Animated Travel Icons */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <div className="relative">
                <MapPin className="w-12 h-12 text-white animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Plane className="w-3 h-3 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float-slow"></div>
            <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-float-fast"></div>
            <div className="absolute top-8 -right-8 w-4 h-4 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-float-medium"></div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-ping animation-delay-300"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {message}
            </h3>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce animation-delay-150"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce animation-delay-300"></div>
            </div>

            <p className="text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              Preparing your travel experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative mb-6">
        {showIcon && (
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <MapPin
              className={`${iconSizeClasses.md} text-white/90 animate-pulse`}
            />
          </div>
        )}

        {/* Spinner Overlay */}
        <div className="absolute inset-0 rounded-2xl border-4 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin">
          <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl m-0.5"></div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h4 className="text-lg font-semibold text-slate-900">{message}</h4>

        {/* Progress Bar */}
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-loading-bar"></div>
        </div>

        <p className="text-slate-600 text-sm">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default Loading;

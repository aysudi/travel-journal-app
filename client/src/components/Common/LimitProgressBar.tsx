import { Crown, AlertCircle } from "lucide-react";

interface LimitProgressBarProps {
  current: number;
  limit: number;
  label: string;
  isPremium?: boolean;
  className?: string;
  showUpgradeHint?: boolean;
  onUpgradeClick?: () => void;
}

const LimitProgressBar = ({
  current,
  limit,
  label,
  isPremium = false,
  className = "",
  showUpgradeHint = false,
  onUpgradeClick,
}: LimitProgressBarProps) => {
  if (limit === -1) {
    return (
      <div
        className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-800">{label}</span>
          </div>
          <span className="text-sm text-green-600 font-semibold">
            Unlimited
          </span>
        </div>
      </div>
    );
  }

  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  const getProgressColor = () => {
    if (isAtLimit) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getBgColor = () => {
    if (isAtLimit) return "from-red-50 to-rose-50 border-red-200";
    if (isNearLimit) return "from-yellow-50 to-amber-50 border-yellow-200";
    return "from-blue-50 to-indigo-50 border-blue-200";
  };

  return (
    <div
      className={`bg-gradient-to-r ${getBgColor()} rounded-lg p-3 border ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isAtLimit && <AlertCircle size={16} className="text-red-500" />}
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
        <span className="text-sm text-gray-600">
          {current}/{limit}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {(isAtLimit || (isNearLimit && showUpgradeHint)) && !isPremium && (
        <div className="flex items-center justify-between text-xs">
          <span className={`${isAtLimit ? "text-red-600" : "text-yellow-600"}`}>
            {isAtLimit ? "Limit reached!" : "Nearly at limit"}
          </span>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LimitProgressBar;

import { useState } from "react";
import { useChangePassword } from "../../../hooks/useAuth";
import { enqueueSnackbar } from "notistack";

type Props = {
  setShowChangePassword: (show: boolean) => void;
};

const ChangePassword = ({ setShowChangePassword }: Props) => {
  const changePasswordMutation = useChangePassword();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar("New passwords do not match", {
        variant: "error",
      });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(passwordData);

      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      enqueueSnackbar("Password changed successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      enqueueSnackbar("Failed to change password. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePasswordChange}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium"
          >
            Update Password
          </button>
          <button
            onClick={() => setShowChangePassword(false)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

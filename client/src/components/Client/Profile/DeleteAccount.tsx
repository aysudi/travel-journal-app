import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useDeleteAccount } from "../../../hooks/useAuth";

const DeleteAccount = ({ user }: any) => {
  const deleteAccount = useDeleteAccount(user?.id);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-end mt-10">
      <div className="w-full bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col items-center shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
            />
          </svg>
          <span className="text-lg font-semibold text-red-700">
            Danger Zone
          </span>
        </div>
        <p className="text-sm text-red-600 text-center mb-4">
          Deleting your account is <b>irreversible</b>. All your data will be
          lost and cannot be recovered.
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow border border-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          onClick={async () => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                await deleteAccount.mutateAsync();
                localStorage.removeItem("token");
                navigate("/auth/login");
                Swal.fire({
                  title: "Deleted!",
                  text: "Account has been deleted.",
                  icon: "success",
                });
              }
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
            />
          </svg>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;

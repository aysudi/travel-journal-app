import { UserCheck, Users } from "lucide-react";

const OwnersSection = ({ travelList }: { travelList: any }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">List Members</h3>
      <div
        className={`grid grid-cols-1 gap-6 ${
          travelList?.customPermissions?.filter(
            (p: any) => p.level === "co-owner"
          )?.length > 0 &&
          travelList?.customPermissions?.filter(
            (p: any) => p.level !== "co-owner"
          )?.length > 0
            ? "md:grid-cols-3"
            : travelList?.customPermissions?.filter(
                (p: any) => p.level === "co-owner"
              )?.length > 0 ||
              travelList?.customPermissions?.filter(
                (p: any) => p.level !== "co-owner"
              )?.length > 0
            ? "md:grid-cols-2"
            : "md:grid-cols-1"
        }`}
      >
        {/* Owner */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <Users size={16} />
            Owner
          </h4>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            {(travelList?.owner as any)?.profileImage ? (
              <img
                src={(travelList.owner as any).profileImage}
                alt={(travelList.owner as any).fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ring-2 ring-indigo-200">
                <span className="text-white font-semibold text-sm">
                  {(travelList?.owner as any)?.fullName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {(travelList?.owner as any)?.fullName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                @{(travelList?.owner as any)?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Co-owners - Only show if they exist */}
        {travelList?.customPermissions?.filter(
          (p: any) => p.level === "co-owner"
        )?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
              <UserCheck size={16} />
              Co-owners (
              {travelList?.customPermissions?.filter(
                (p: any) => p.level === "co-owner"
              )?.length || 0}
              )
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {travelList.customPermissions
                .filter((p: any) => p.level === "co-owner")
                .map((permission: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100"
                  >
                    {permission.user?.profileImage ? (
                      <img
                        src={permission.user.profileImage}
                        alt={permission.user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {permission.user?.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {permission.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{permission.user?.username}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Other Collaborators - Only show if they exist */}
        {travelList?.customPermissions?.filter(
          (p: any) => p.level !== "co-owner"
        )?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
              <Users size={16} />
              Collaborators (
              {travelList?.customPermissions?.filter(
                (p: any) => p.level !== "co-owner"
              )?.length || 0}
              )
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {travelList.customPermissions
                .filter((p: any) => p.level !== "co-owner")
                .map((permission: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    {permission.user?.profileImage ? (
                      <img
                        src={permission.user.profileImage}
                        alt={permission.user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {permission.user?.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {permission.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{permission.user?.username} • {permission.level}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnersSection;

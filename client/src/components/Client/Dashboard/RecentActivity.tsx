import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { MapPin, Users } from "lucide-react";

type RecentActivityProps = {
  ownedLists?: any[];
  collaboratingLists?: any[];
};

const RecentActivity = ({
  ownedLists,
  collaboratingLists,
}: RecentActivityProps) => {
  const recentActivity = [
    ...(ownedLists || []).slice(0, 3).map((list: any) => ({
      id: `owned-${list._id}`,
      listId: list._id,
      type: "owned",
      title: list.title,
      description: `Created ${formatDate(list.createdAt)}`,
      icon: MapPin,
      href: `/lists/${list._id}`,
    })),
    ...(collaboratingLists || []).slice(0, 2).map((list: any) => ({
      id: `collab-${list._id}`,
      listId: list._id,
      type: "collaboration",
      title: list.title,
      description: `Collaborating with ${list.owner?.fullName || "others"}`,
      icon: Users,
      href: `/lists/${list._id}`,
    })),
  ]
    .filter(
      (activity, index, arr) =>
        arr.findIndex((item) => item.listId === activity.listId) === index
    )
    .slice(0, 5);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Activity
            </h2>
            <Link
              to="/my-lists"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition-all duration-200"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <Link
                    key={activity.id}
                    to={activity.href}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === "owned"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {activity.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No recent activity</p>
              <Link
                to="/my-lists"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block hover:bg-blue-50 px-3 py-1 rounded-md transition-all duration-200"
              >
                Create your first travel list
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;

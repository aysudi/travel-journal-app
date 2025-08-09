import { Link } from "react-router-dom";

const StatsGrid = ({ stats }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat: any) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.name}
            to={stat.href}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default StatsGrid;

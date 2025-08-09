import { MapPin, Users, BookOpen } from "lucide-react";

const TravelStatistics = ({ user }: { user: any }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} className="text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {user.ownedLists?.length || 0}
        </h3>
        <p className="text-gray-600">Travel Lists Owned</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {user.collaboratingLists?.length || 0}
        </h3>
        <p className="text-gray-600">Collaborating Lists</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {user.journalEntries?.length || 0}
        </h3>
        <p className="text-gray-600">Journal Entries</p>
      </div>
    </div>
  );
};

export default TravelStatistics;

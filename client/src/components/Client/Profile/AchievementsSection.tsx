import {
  Award,
  Users,
  MapPin,
  BookOpen,
  Sparkles,
  Star,
  Globe2,
  Crown,
} from "lucide-react";
import clsx from "clsx";
import { useJournalEntries } from "../../../hooks/useEntries";
import Loading from "../../Common/Loading";
import { useDestinations } from "../../../hooks/useDestination";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
};

interface AchievementsProps {
  user: any;
  friends: any[];
}

const AchievementsSection = ({ user, friends }: AchievementsProps) => {
  const { data: journals, isLoading } = useJournalEntries();
  const { data: allDestinations, isLoading: destinationsLoading } =
    useDestinations();
  const ownedLists = user?.ownedLists || [];

  if (isLoading || destinationsLoading) {
    return <Loading />;
  }

  const journalEntries: any[] = journals?.filter((j: any) => {
    return j.author._id == user.id;
  });

  const destinations: any[] = [];
  allDestinations?.map((dest: any) => {
    if (dest.list.owner._id == user.id) {
      return destinations.push(dest);
    }
  });

  const achievements = [
    {
      id: "first-friend",
      title: "First Connection",
      description: "Made your first friend!",
      icon: <Users size={32} className="text-blue-500" />,
      achieved: friends.length >= 1,
    },
    {
      id: "social-traveler",
      title: "Social Traveler",
      description: "Own 3 or more travel lists.",
      icon: <MapPin size={32} className="text-purple-500" />,
      achieved: ownedLists.length >= 3,
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Create your first destination.",
      icon: <Globe2 size={32} className="text-green-500" />,
      achieved: destinations.length >= 1,
    },
    {
      id: "journalist",
      title: "Travel Journalist",
      description: "Write your first journal entry.",
      icon: <BookOpen size={32} className="text-orange-500" />,
      achieved: journalEntries.length >= 1,
    },
    {
      id: "friendship-circle",
      title: "Friendship Circle",
      description: "Have 5 or more friends.",
      icon: <Users size={32} className="text-pink-500" />,
      achieved: friends.length >= 5,
    },
    {
      id: "list-master",
      title: "List Master",
      description: "Own 10 or more travel lists.",
      icon: <Star size={32} className="text-yellow-500" />,
      achieved: ownedLists.length >= 10,
    },
    {
      id: "world-traveler",
      title: "World Traveler",
      description: "Create 10 or more destinations.",
      icon: <Globe2 size={32} className="text-indigo-500" />,
      achieved: destinations.length >= 10,
    },
    {
      id: "storyteller",
      title: "Storyteller",
      description: "Write 10 or more journal entries.",
      icon: <BookOpen size={32} className="text-teal-500" />,
      achieved: journalEntries.length >= 10,
    },
    {
      id: "premium",
      title: "Premium Member",
      description: "Unlock premium features!",
      icon: <Crown size={32} className="text-yellow-500" />,
      achieved: !!user?.premium,
    },
    {
      id: "super-social",
      title: "Super Social",
      description: "Have 20 or more friends.",
      icon: <Sparkles size={32} className="text-fuchsia-500" />,
      achieved: friends.length >= 20,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Award size={24} className="text-yellow-500" />
        <h3 className="text-2xl font-bold text-gray-800">Achievements</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={clsx(
              "flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border transition-all duration-200",
              ach.achieved
                ? "border-yellow-400 shadow-lg scale-105"
                : "border-gray-200 opacity-60"
            )}
          >
            <div className="mb-3">{ach.icon}</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-1">
              {ach.title}
            </h4>
            <p className="text-gray-500 text-sm text-center">
              {ach.description}
            </p>
            {ach.achieved && (
              <span className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Achieved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;

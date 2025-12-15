import { useQuery } from "@tanstack/react-query";

interface UserLimits {
  isPremium: boolean;
  limits: {
    TRAVEL_LISTS: number;
    DESTINATIONS_PER_LIST: number;
    JOURNAL_ENTRIES: number;
    IMAGES_PER_JOURNAL: number;
    COLLABORATORS_PER_LIST: number;
    STORAGE_MB: number;
  };
  usage: {
    travelLists: number;
    journalEntries: number;
  };
  premiumExpiresAt?: string;
}

const fetchUserLimits = async (): Promise<UserLimits> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5050/travel-lists/limits", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user limits");
  }

  const result = await response.json();
  return result.data;
};

export const useUserLimits = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userLimits"],
    queryFn: fetchUserLimits,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    limits: data,
    isLoading,
    error,
    refetch,
  };
};

export const useLimitCheck = () => {
  const { limits } = useUserLimits();

  const checkTravelListLimit = () => {
    if (!limits) return { canCreate: true, usage: 0, limit: 0 };

    const { usage, limits: userLimits } = limits;
    const limit = userLimits.TRAVEL_LISTS;

    return {
      canCreate: limit === -1 || usage.travelLists < limit,
      usage: usage.travelLists,
      limit,
      isPremium: limits.isPremium,
    };
  };

  const checkJournalEntryLimit = () => {
    if (!limits) return { canCreate: true, usage: 0, limit: 0 };

    const { usage, limits: userLimits } = limits;
    const limit = userLimits.JOURNAL_ENTRIES;

    return {
      canCreate: limit === -1 || usage.journalEntries < limit,
      usage: usage.journalEntries,
      limit,
      isPremium: limits.isPremium,
    };
  };

  const getDestinationLimit = () => {
    if (!limits) return { limit: 10, isPremium: false };

    return {
      limit: limits.limits.DESTINATIONS_PER_LIST,
      isPremium: limits.isPremium,
    };
  };

  const getImageLimit = () => {
    if (!limits) return { limit: 1, isPremium: false };

    return {
      limit: limits.limits.IMAGES_PER_JOURNAL,
      isPremium: limits.isPremium,
    };
  };

  return {
    checkTravelListLimit,
    checkJournalEntryLimit,
    getDestinationLimit,
    getImageLimit,
    limits,
  };
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { friendsService } from "../services/friendsService";

export const FRIENDS_QUERY_KEYS = {
  friends: ["friends"] as const,
  search: (query: string) => ["friends", "search", query] as const,
};

// Get user's friends data
export const useFriends = () => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.friends,
    queryFn: () => friendsService.getUserFriends(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search users
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.search(query),
    queryFn: () => friendsService.searchUsers(query),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
  });
};

// Send friend request
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) =>
      friendsService.sendFriendRequest(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.friends });
      queryClient.invalidateQueries({ queryKey: ["friends", "search"] });
    },
    onError: (error: any) => {
      console.error("Failed to send friend request:", error);
    },
  });
};

// Accept friend request
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fromUserId: string) =>
      friendsService.acceptFriendRequest(fromUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.friends });
    },
    onError: (error: any) => {
      console.error("Failed to accept friend request:", error);
    },
  });
};

// Reject friend request
export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fromUserId: string) =>
      friendsService.rejectFriendRequest(fromUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.friends });
    },
    onError: (error: any) => {
      console.error("Failed to reject friend request:", error);
    },
  });
};

// Remove friend
export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => friendsService.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEYS.friends });
    },
    onError: (error: any) => {
      console.error("Failed to remove friend:", error);
    },
  });
};

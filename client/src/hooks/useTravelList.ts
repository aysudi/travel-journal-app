import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  travelListService,
  type CreateTravelListData,
  type UpdateTravelListData,
  type TravelList,
  type PaginationParams,
} from "../services";

// Query Keys for cache management
export const travelListKeys = {
  all: ["travelLists"] as const,
  lists: () => [...travelListKeys.all, "list"] as const,
  list: (id: string) => [...travelListKeys.all, "list", id] as const,
  owned: () => [...travelListKeys.all, "owned"] as const,
  collaborating: () => [...travelListKeys.all, "collaborating"] as const,
  public: () => [...travelListKeys.all, "public"] as const,
  search: (params: PaginationParams) =>
    [...travelListKeys.all, "search", params] as const,
};

// Get all travel lists (with pagination and search)
export const useTravelLists = (params?: PaginationParams) => {
  return useQuery({
    queryKey: travelListKeys.search(params || {}),
    queryFn: () => travelListService.getTravelLists(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Get single travel list by ID
export const useTravelList = (id: string) => {
  return useQuery({
    queryKey: travelListKeys.list(id),
    queryFn: () => travelListService.getTravelListById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!id,
  });
};

// Get owned travel lists
export const useOwnedTravelLists = () => {
  return useQuery({
    queryKey: travelListKeys.owned(),
    queryFn: () => travelListService.getOwnedLists(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Get collaborating travel lists
export const useCollaboratingTravelLists = () => {
  return useQuery({
    queryKey: travelListKeys.collaborating(),
    queryFn: () => travelListService.getCollaboratingLists(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Get friends' travel lists
export const useFriendsTravelLists = (limit?: number) => {
  return useQuery({
    queryKey: ["travel-lists", "friends", limit],
    queryFn: () => travelListService.getFriendsLists(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Get public travel lists
export const usePublicTravelLists = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...travelListKeys.public(), params || {}],
    queryFn: () => travelListService.getPublicLists(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Create travel list mutation
export const useCreateTravelList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTravelListData) =>
      travelListService.createTravelList(data),
    onSuccess: (newList: TravelList) => {
      queryClient.invalidateQueries({ queryKey: travelListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travelListKeys.owned() });

      queryClient.setQueryData(travelListKeys.list(newList.id), newList);
    },
    onError: (error) => {
      console.error("Failed to create travel list:", error);
    },
  });
};

// Update travel list mutation
export const useUpdateTravelList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTravelListData }) =>
      travelListService.updateTravelList(id, data),
    onSuccess: (updatedList: TravelList) => {
      queryClient.setQueryData(
        travelListKeys.list(updatedList.id),
        updatedList
      );

      queryClient.invalidateQueries({ queryKey: travelListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travelListKeys.owned() });
      queryClient.invalidateQueries({
        queryKey: travelListKeys.collaborating(),
      });
    },
    onError: (error) => {
      console.error("Failed to update travel list:", error);
    },
  });
};

// Delete travel list mutation
export const useDeleteTravelList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => travelListService.deleteTravelList(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: travelListKeys.list(deletedId) });

      queryClient.invalidateQueries({ queryKey: travelListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travelListKeys.owned() });
      queryClient.invalidateQueries({
        queryKey: travelListKeys.collaborating(),
      });
    },
    onError: (error) => {
      console.error("Failed to delete travel list:", error);
    },
  });
};

// Add collaborator mutation
export const useAddCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, userId }: { listId: string; userId: string }) =>
      travelListService.addCollaborator(listId, userId),
    onSuccess: (updatedList: TravelList) => {
      queryClient.setQueryData(
        travelListKeys.list(updatedList.id),
        updatedList
      );

      queryClient.invalidateQueries({
        queryKey: travelListKeys.collaborating(),
      });
    },
    onError: (error) => {
      console.error("Failed to add collaborator:", error);
    },
  });
};

// Remove collaborator mutation
export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, userId }: { listId: string; userId: string }) =>
      travelListService.removeCollaborator(listId, userId),
    onSuccess: (updatedList: TravelList) => {
      queryClient.setQueryData(
        travelListKeys.list(updatedList.id),
        updatedList
      );

      queryClient.invalidateQueries({
        queryKey: travelListKeys.collaborating(),
      });
    },
    onError: (error) => {
      console.error("Failed to remove collaborator:", error);
    },
  });
};

// Upload cover image mutation
export const useUploadCoverImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, file }: { listId: string; file: File }) =>
      travelListService.uploadCoverImage(listId, file),
    onSuccess: (result, variables) => {
      queryClient.setQueryData(
        travelListKeys.list(variables.listId),
        (oldData: TravelList | undefined) =>
          oldData ? { ...oldData, coverImage: result.coverImage } : oldData
      );

      queryClient.invalidateQueries({ queryKey: travelListKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to upload cover image:", error);
    },
  });
};

// Duplicate travel list mutation
export const useDuplicateTravelList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => travelListService.duplicateList(listId),
    onSuccess: (duplicatedList: TravelList) => {
      queryClient.setQueryData(
        travelListKeys.list(duplicatedList.id),
        duplicatedList
      );

      queryClient.invalidateQueries({ queryKey: travelListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travelListKeys.owned() });
    },
    onError: (error) => {
      console.error("Failed to duplicate travel list:", error);
    },
  });
};

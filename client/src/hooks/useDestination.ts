import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  destinationService,
  type CreateDestinationData,
  type Destination,
  type PaginationParams,
} from "../services";

export const destinationKeys = {
  all: ["destinations"] as const,
  lists: () => [...destinationKeys.all, "list"] as const,
  list: (id: string) => [...destinationKeys.all, "list", id] as const,
  byTravelList: (travelListId: string) =>
    [...destinationKeys.all, "travelList", travelListId] as const,
  search: (params: PaginationParams) =>
    [...destinationKeys.all, "search", params] as const,
};

export const useDestinations = (
  travelListId?: string,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: destinationKeys.search({
      ...params,
      travelListId,
    } as PaginationParams & { travelListId?: string }),
    queryFn: () => destinationService.getDestinations(travelListId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useDestination = (id: string) => {
  return useQuery({
    queryKey: destinationKeys.list(id),
    queryFn: () => destinationService.getDestinationById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!id,
  });
};

export const useDestinationsByTravelList = (travelListId: string) => {
  return useQuery({
    queryKey: destinationKeys.byTravelList(travelListId),
    queryFn: () => destinationService.getDestinations(travelListId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!travelListId,
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDestinationData) =>
      destinationService.createDestination(data),
    onSuccess: (newDestination: Destination) => {
      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: destinationKeys.byTravelList(newDestination.travelList),
      });

      queryClient.setQueryData(
        destinationKeys.list(newDestination._id),
        newDestination
      );

      queryClient.invalidateQueries({
        queryKey: ["travelLists", "list", newDestination.travelList],
      });
    },
    onError: (error) => {
      console.error("Failed to create destination:", error);
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateDestinationData>;
    }) => destinationService.updateDestination(id, data),
    onSuccess: (updatedDestination: Destination) => {
      queryClient.setQueryData(
        destinationKeys.list(updatedDestination._id),
        updatedDestination
      );

      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: destinationKeys.byTravelList(updatedDestination.travelList),
      });

      queryClient.invalidateQueries({
        queryKey: ["travelLists", "list", updatedDestination.travelList],
      });
    },
    onError: (error) => {
      console.error("Failed to update destination:", error);
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => destinationService.deleteDestination(id),
    onSuccess: (_, deletedId) => {
      const cachedDestination = queryClient.getQueryData<Destination>(
        destinationKeys.list(deletedId)
      );

      queryClient.removeQueries({ queryKey: destinationKeys.list(deletedId) });

      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });

      if (cachedDestination) {
        queryClient.invalidateQueries({
          queryKey: destinationKeys.byTravelList(cachedDestination.travelList),
        });

        queryClient.invalidateQueries({
          queryKey: ["travelLists", "list", cachedDestination.travelList],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete destination:", error);
    },
  });
};

export const useUploadDestinationImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      destinationId,
      files,
    }: {
      destinationId: string;
      files: File[];
    }) => destinationService.uploadDestinationImages(destinationId, files),
    onSuccess: (result, variables) => {
      queryClient.setQueryData(
        destinationKeys.list(variables.destinationId),
        (oldData: Destination | undefined) =>
          oldData
            ? { ...oldData, images: [...oldData.images, ...result.images] }
            : oldData
      );

      const cachedDestination = queryClient.getQueryData<Destination>(
        destinationKeys.list(variables.destinationId)
      );

      if (cachedDestination) {
        queryClient.invalidateQueries({
          queryKey: destinationKeys.byTravelList(cachedDestination.travelList),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to upload destination images:", error);
    },
  });
};

export const useBulkDeleteDestinations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationIds: string[]) => {
      const results = await Promise.allSettled(
        destinationIds.map((id) => destinationService.deleteDestination(id))
      );
      return results;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: destinationKeys.list(id) });
      });

      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: destinationKeys.all });
    },
    onError: (error) => {
      console.error("Failed to bulk delete destinations:", error);
    },
  });
};

export const useOptimisticDestinationUpdate = () => {
  const queryClient = useQueryClient();

  const updateDestinationOptimistically = (
    destinationId: string,
    updates: Partial<Destination>
  ) => {
    queryClient.setQueryData(
      destinationKeys.list(destinationId),
      (oldData: Destination | undefined) =>
        oldData ? { ...oldData, ...updates } : oldData
    );
  };

  const revertDestinationUpdate = (destinationId: string) => {
    queryClient.invalidateQueries({
      queryKey: destinationKeys.list(destinationId),
    });
  };

  return { updateDestinationOptimistically, revertDestinationUpdate };
};

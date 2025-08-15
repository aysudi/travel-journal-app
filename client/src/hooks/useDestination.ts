import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  destinationService,
  type CreateDestinationData,
  type Destination,
} from "../services";

export const destinationKeys = {
  all: ["destinations"] as const,
  lists: () => [...destinationKeys.all, "list"] as const,
  list: (id: string) => [...destinationKeys.all, "list", id] as const,
  byTravelList: (travelListId: string) =>
    [...destinationKeys.all, "travelList", travelListId] as const,
  search: (params: any) => [...destinationKeys.all, "search", params] as const,
};

export const useDestinations = (
  travelListId?: string,
  params?: { search?: string; sort?: string; status?: string }
) => {
  return useQuery({
    queryKey: destinationKeys.search({
      ...params,
      travelListId,
    }),
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
    mutationFn: (data: CreateDestinationData | FormData) =>
      destinationService.createDestination(data),
    onSuccess: (newDestination: Destination) => {
      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: destinationKeys.byTravelList(newDestination.list),
      });

      queryClient.setQueryData(
        destinationKeys.list(newDestination.id),
        newDestination
      );

      queryClient.invalidateQueries({
        queryKey: ["travelLists", "list", newDestination.list],
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
      data: Partial<CreateDestinationData> | FormData;
    }) => destinationService.updateDestination(id, data),
    onSuccess: (updatedDestination: Destination) => {
      queryClient.setQueryData(
        destinationKeys.list(updatedDestination.id),
        updatedDestination
      );

      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: destinationKeys.byTravelList(updatedDestination.list),
      });

      queryClient.invalidateQueries({
        queryKey: ["travelLists", "list", updatedDestination.list],
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
        queryClient.setQueryData(
          destinationKeys.byTravelList(cachedDestination.list),
          (old: Destination[] | undefined) =>
            old?.filter((d) => d.id !== deletedId)
        );

        queryClient.invalidateQueries({
          queryKey: destinationKeys.byTravelList(cachedDestination.list),
        });

        queryClient.invalidateQueries({
          queryKey: ["travelLists", "list", cachedDestination.list],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete destination:", error);
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

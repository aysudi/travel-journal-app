import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  journalEntryService,
  type CreateJournalEntryData,
  type JournalEntry,
  type PaginationParams,
} from "../services";

export const journalEntryKeys = {
  all: ["journalEntries"] as const,
  lists: () => [...journalEntryKeys.all, "list"] as const,
  list: (id: string) => [...journalEntryKeys.all, "list", id] as const,
  byTravelList: (travelListId: string) =>
    [...journalEntryKeys.all, "travelList", travelListId] as const,
  byDestination: (destinationId: string) =>
    [...journalEntryKeys.all, "destination", destinationId] as const,
  byAuthor: (authorId: string) =>
    [...journalEntryKeys.all, "author", authorId] as const,
  public: () => [...journalEntryKeys.all, "public"] as const,
  search: (
    params: PaginationParams & {
      destinationId?: string;
      travelListId?: string;
      authorId?: string;
    }
  ) => [...journalEntryKeys.all, "search", params] as const,
};

export const useJournalEntries = (
  params?: PaginationParams & {
    destinationId?: string;
    travelListId?: string;
    authorId?: string;
  }
) => {
  return useQuery({
    queryKey: journalEntryKeys.search(params || {}),
    queryFn: () => journalEntryService.getJournalEntries(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useJournalEntry = (id: string) => {
  return useQuery({
    queryKey: journalEntryKeys.list(id),
    queryFn: () => journalEntryService.getJournalEntryById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!id,
  });
};

export const useJournalEntriesByTravelList = (travelListId: string) => {
  return useQuery({
    queryKey: journalEntryKeys.byTravelList(travelListId),
    queryFn: () => journalEntryService.getJournalEntries({ travelListId }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!travelListId,
  });
};

export const useJournalEntriesByDestination = (destinationId: string) => {
  return useQuery({
    queryKey: journalEntryKeys.byDestination(destinationId),
    queryFn: () => journalEntryService.getJournalEntries({ destinationId }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!destinationId,
  });
};

export const useJournalEntriesByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: journalEntryKeys.byAuthor(authorId),
    queryFn: () => journalEntryService.getJournalEntries({ authorId }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!authorId,
  });
};

export const usePublicJournalEntries = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...journalEntryKeys.public(), params || {}],
    queryFn: () => journalEntryService.getPublicEntries(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJournalEntryData) =>
      journalEntryService.createJournalEntry(data),
    onSuccess: (newEntry: JournalEntry) => {
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });

      if (newEntry.travelList) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byTravelList(newEntry.travelList),
        });
      }

      if (newEntry.destination) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byDestination(newEntry.destination),
        });
      }

      queryClient.invalidateQueries({
        queryKey: journalEntryKeys.byAuthor(newEntry.author),
      });

      if (newEntry.isPublic) {
        queryClient.invalidateQueries({ queryKey: journalEntryKeys.public() });
      }

      queryClient.setQueryData(journalEntryKeys.list(newEntry._id), newEntry);

      if (newEntry.travelList) {
        queryClient.invalidateQueries({
          queryKey: ["travelLists", "list", newEntry.travelList],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to create journal entry:", error);
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateJournalEntryData>;
    }) => journalEntryService.updateJournalEntry(id, data),
    onSuccess: (updatedEntry: JournalEntry) => {
      queryClient.setQueryData(
        journalEntryKeys.list(updatedEntry._id),
        updatedEntry
      );

      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });

      if (updatedEntry.travelList) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byTravelList(updatedEntry.travelList),
        });
      }

      if (updatedEntry.destination) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byDestination(updatedEntry.destination),
        });
      }

      queryClient.invalidateQueries({
        queryKey: journalEntryKeys.byAuthor(updatedEntry.author),
      });

      queryClient.invalidateQueries({ queryKey: journalEntryKeys.public() });

      if (updatedEntry.travelList) {
        queryClient.invalidateQueries({
          queryKey: ["travelLists", "list", updatedEntry.travelList],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update journal entry:", error);
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalEntryService.deleteJournalEntry(id),
    onSuccess: (_, deletedId) => {
      const cachedEntry = queryClient.getQueryData<JournalEntry>(
        journalEntryKeys.list(deletedId)
      );

      queryClient.removeQueries({ queryKey: journalEntryKeys.list(deletedId) });

      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });

      if (cachedEntry) {
        if (cachedEntry.travelList) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.byTravelList(cachedEntry.travelList),
          });

          queryClient.invalidateQueries({
            queryKey: ["travelLists", "list", cachedEntry.travelList],
          });
        }

        if (cachedEntry.destination) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.byDestination(cachedEntry.destination),
          });
        }

        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byAuthor(cachedEntry.author),
        });

        if (cachedEntry.isPublic) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.public(),
          });
        }
      } else {
        queryClient.invalidateQueries({ queryKey: journalEntryKeys.all });
      }
    },
    onError: (error) => {
      console.error("Failed to delete journal entry:", error);
    },
  });
};

export const useUploadJournalImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, files }: { entryId: string; files: File[] }) =>
      journalEntryService.uploadJournalImages(entryId, files),
    onSuccess: (result, variables) => {
      queryClient.setQueryData(
        journalEntryKeys.list(variables.entryId),
        (oldData: JournalEntry | undefined) =>
          oldData
            ? { ...oldData, images: [...oldData.images, ...result.images] }
            : oldData
      );

      const cachedEntry = queryClient.getQueryData<JournalEntry>(
        journalEntryKeys.list(variables.entryId)
      );

      if (cachedEntry) {
        if (cachedEntry.travelList) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.byTravelList(cachedEntry.travelList),
          });
        }

        if (cachedEntry.destination) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.byDestination(cachedEntry.destination),
          });
        }

        if (cachedEntry.isPublic) {
          queryClient.invalidateQueries({
            queryKey: journalEntryKeys.public(),
          });
        }
      }
    },
    onError: (error) => {
      console.error("Failed to upload journal images:", error);
    },
  });
};

export const useBulkDeleteJournalEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryIds: string[]) => {
      const results = await Promise.allSettled(
        entryIds.map((id) => journalEntryService.deleteJournalEntry(id))
      );
      return results;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: journalEntryKeys.list(id) });
      });

      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.all });
    },
    onError: (error) => {
      console.error("Failed to bulk delete journal entries:", error);
    },
  });
};

export const useToggleJournalEntryVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      journalEntryService.updateJournalEntry(id, { isPublic }),
    onSuccess: (updatedEntry: JournalEntry) => {
      queryClient.setQueryData(
        journalEntryKeys.list(updatedEntry._id),
        updatedEntry
      );

      queryClient.invalidateQueries({ queryKey: journalEntryKeys.public() });

      if (updatedEntry.travelList) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byTravelList(updatedEntry.travelList),
        });
      }

      if (updatedEntry.destination) {
        queryClient.invalidateQueries({
          queryKey: journalEntryKeys.byDestination(updatedEntry.destination),
        });
      }

      queryClient.invalidateQueries({
        queryKey: journalEntryKeys.byAuthor(updatedEntry.author),
      });
    },
    onError: (error) => {
      console.error("Failed to toggle journal entry visibility:", error);
    },
  });
};

export const useOptimisticJournalEntryUpdate = () => {
  const queryClient = useQueryClient();

  const updateJournalEntryOptimistically = (
    entryId: string,
    updates: Partial<JournalEntry>
  ) => {
    queryClient.setQueryData(
      journalEntryKeys.list(entryId),
      (oldData: JournalEntry | undefined) =>
        oldData ? { ...oldData, ...updates } : oldData
    );
  };

  const revertJournalEntryUpdate = (entryId: string) => {
    queryClient.invalidateQueries({
      queryKey: journalEntryKeys.list(entryId),
    });
  };

  return { updateJournalEntryOptimistically, revertJournalEntryUpdate };
};

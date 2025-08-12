import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listInvitationService } from "../services/contentService";
import type { ListInvitation, CreateListInvitationData } from "../types/api";

// Query Keys
export const listInvitationKeys = {
  all: ["listInvitations"] as const,
  lists: () => [...listInvitationKeys.all, "list"] as const,
  list: (id: string) => [...listInvitationKeys.lists(), id] as const,
  byInvitee: (inviteeId: string) =>
    [...listInvitationKeys.all, "invitee", inviteeId] as const,
  byInviter: (inviterId: string) =>
    [...listInvitationKeys.all, "inviter", inviterId] as const,
  byInviteeStatus: (inviteeId: string, status: string) =>
    [...listInvitationKeys.byInvitee(inviteeId), status] as const,
  byInviterStatus: (inviterId: string, status: string) =>
    [...listInvitationKeys.byInviter(inviterId), status] as const,
};

// Get all invitations
export const useAllListInvitations = () => {
  return useQuery({
    queryKey: listInvitationKeys.lists(),
    queryFn: () => listInvitationService.getAllInvitations(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Get invitation by ID
export const useListInvitation = (id: string) => {
  return useQuery({
    queryKey: listInvitationKeys.list(id),
    queryFn: () => listInvitationService.getInvitationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Get invitations by invitee (received invitations)
export const useInvitationsByInvitee = (inviteeId: string, status?: string) => {
  return useQuery({
    queryKey: status
      ? listInvitationKeys.byInviteeStatus(inviteeId, status)
      : listInvitationKeys.byInvitee(inviteeId),
    queryFn: () =>
      listInvitationService.getInvitationsByInvitee(inviteeId, status),
    enabled: !!inviteeId, // Only run when inviteeId is truthy
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Get invitations by inviter (sent invitations)
export const useInvitationsByInviter = (inviterId: string, status?: string) => {
  return useQuery({
    queryKey: status
      ? listInvitationKeys.byInviterStatus(inviterId, status)
      : listInvitationKeys.byInviter(inviterId),
    queryFn: () =>
      listInvitationService.getInvitationsByInviter(inviterId, status),
    enabled: !!inviterId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Create invitation mutation
export const useCreateListInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationData: CreateListInvitationData) =>
      listInvitationService.createInvitation(invitationData),
    onSuccess: (newInvitation: ListInvitation) => {
      queryClient.invalidateQueries({ queryKey: listInvitationKeys.all });

      if (typeof newInvitation.invitee === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInvitee(newInvitation.invitee),
        });
      }

      if (typeof newInvitation.inviter === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInviter(newInvitation.inviter),
        });
      }

      queryClient.setQueryData(
        listInvitationKeys.list(newInvitation._id),
        newInvitation
      );
    },
    onError: (error) => {
      console.error("Failed to create invitation:", error);
    },
  });
};

// Accept invitation mutation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      listInvitationService.acceptInvitation(invitationId),
    onSuccess: (acceptedInvitation: ListInvitation) => {
      // Invalidate all invitation-related queries
      queryClient.invalidateQueries({ queryKey: listInvitationKeys.all });

      // Update the specific invitation in cache
      queryClient.setQueryData(
        listInvitationKeys.list(acceptedInvitation._id),
        acceptedInvitation
      );

      // Invalidate user's received invitations
      if (typeof acceptedInvitation.invitee === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInvitee(acceptedInvitation.invitee),
        });
      }

      // Invalidate inviter's sent invitations
      if (typeof acceptedInvitation.inviter === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInviter(acceptedInvitation.inviter),
        });
      }

      // Invalidate travel list related queries to update collaborating lists
      queryClient.invalidateQueries({ queryKey: ["travelLists"] });
      queryClient.invalidateQueries({ queryKey: ["ownedTravelLists"] });
      queryClient.invalidateQueries({ queryKey: ["collaboratingTravelLists"] });
    },
    onError: (error) => {
      console.error("Failed to accept invitation:", error);
    },
  });
};

// Reject invitation mutation
export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      listInvitationService.rejectInvitation(invitationId),
    onSuccess: (rejectedInvitation: ListInvitation) => {
      queryClient.invalidateQueries({ queryKey: listInvitationKeys.all });

      queryClient.setQueryData(
        listInvitationKeys.list(rejectedInvitation._id),
        rejectedInvitation
      );

      if (typeof rejectedInvitation.invitee === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInvitee(rejectedInvitation.invitee),
        });
      }

      if (typeof rejectedInvitation.inviter === "string") {
        queryClient.invalidateQueries({
          queryKey: listInvitationKeys.byInviter(rejectedInvitation.inviter),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to reject invitation:", error);
    },
  });
};

// Cancel invitation mutation (for inviters)
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      listInvitationService.cancelInvitation(invitationId),
    onSuccess: (_, invitationId) => {
      queryClient.invalidateQueries({ queryKey: listInvitationKeys.all });

      queryClient.removeQueries({
        queryKey: listInvitationKeys.list(invitationId),
      });
    },
    onError: (error) => {
      console.error("Failed to cancel invitation:", error);
    },
  });
};

// Helper hooks for specific invitation statuses

// Get pending invitations received by user
export const usePendingReceivedInvitations = (userId: string) => {
  return useQuery({
    queryKey: listInvitationKeys.byInviteeStatus(userId, "pending"),
    queryFn: async () => {
      const result = await listInvitationService.getInvitationsByInvitee(
        userId,
        "pending"
      );
      return result;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Get pending invitations sent by user
export const usePendingSentInvitations = (userId: string) => {
  return useInvitationsByInviter(userId, "pending");
};

// Get accepted invitations received by user
export const useAcceptedReceivedInvitations = (userId: string) => {
  return useInvitationsByInvitee(userId, "accepted");
};

// Get accepted invitations sent by user
export const useAcceptedSentInvitations = (userId: string) => {
  return useInvitationsByInviter(userId, "accepted");
};

// Convenience hook for sending invitation with toast notifications
export const useSendInvitation = () => {
  const createInvitation = useCreateListInvitation();

  return useMutation({
    mutationFn: async (data: {
      listId: string;
      inviteeEmail: string;
      permissionLevel: "view" | "suggest" | "contribute" | "co-owner";
      message?: string;
    }) => {
      const invitationData: CreateListInvitationData = {
        list: data.listId,
        inviteeEmail: data.inviteeEmail,
        permissionLevel: data.permissionLevel,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      return createInvitation.mutateAsync(invitationData);
    },
    onSuccess: (invitation) => {
      console.log("Invitation sent successfully:", invitation);
    },
    onError: (error) => {
      console.error("Failed to send invitation:", error);
    },
  });
};

// Convenience hook for batch invitation actions
export const useBatchInvitationActions = () => {
  const acceptInvitation = useAcceptInvitation();
  const rejectInvitation = useRejectInvitation();
  const cancelInvitation = useCancelInvitation();

  return {
    acceptInvitation: acceptInvitation.mutateAsync,
    rejectInvitation: rejectInvitation.mutateAsync,
    cancelInvitation: cancelInvitation.mutateAsync,
    isLoading:
      acceptInvitation.isPending ||
      rejectInvitation.isPending ||
      cancelInvitation.isPending,
  };
};

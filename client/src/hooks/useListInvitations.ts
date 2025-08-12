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

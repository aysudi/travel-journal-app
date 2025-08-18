import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../services/chatService";

const chatService = new ChatService();

export const useAllChats = () => {
  return useQuery({
    queryKey: ["chats", "all"],
    queryFn: () => chatService.getChats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCurrentUserChats = (userId: string) => {
  return useQuery({
    queryKey: ["chats", "user", userId],
    queryFn: () => chatService.getCurrentUserChats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => chatService.createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useUpdateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      chatService.updateChat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatService.deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

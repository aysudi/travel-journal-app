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

export const useCurrentListChats = (listId: string) => {
  return useQuery({
    queryKey: ["chats", "list", listId],
    queryFn: () => chatService.getCurrentListChats(listId),
    enabled: !!listId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useGetOrCreateChatByListId = (listId: string, userId: string) => {
  return useQuery({
    queryKey: ["chat", "by-list", listId, userId],
    queryFn: () => chatService.getOrCreateChatByListId(listId, userId),
    enabled: !!listId && !!userId,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    retry: 1,
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
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return chatService.updateChat(id, data);
    },
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

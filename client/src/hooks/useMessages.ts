import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageService } from "../services/mesageService";

const messageService = new MessageService();

export const useAllMessages = () => {
  return useQuery({
    queryKey: ["messages", "all"],
    queryFn: () => messageService.getAllMessages(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

type GetMessagesByChatParams = {
  userId?: string;
  page?: number;
  limit?: number;
};

export const useMessagesByChat = (
  chatId: string,
  params?: GetMessagesByChatParams
) => {
  const finalParams = { ...params, limit: params?.limit ?? 1000 };
  return useQuery({
    queryKey: ["messages", "chat", chatId, finalParams],
    queryFn: () => messageService.getMessagesByChat(chatId, finalParams),
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => messageService.createMessage(data),
    onSuccess: (_data, variables) => {
      if (variables && variables.chat) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "chat", variables.chat],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", "all"] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; data: any; chat?: string }) =>
      messageService.updateMessage(vars.id, vars.data),
    onSuccess: (_data, variables) => {
      if (variables && variables.chat) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "chat", variables.chat],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", "all"] });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { messageId: string; data: any; chat?: string }) =>
      messageService.markMessageAsRead(vars.messageId, vars.data),
    onSuccess: (_data, variables) => {
      if (variables && variables.chat) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "chat", variables.chat],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", "all"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; chat?: string }) =>
      messageService.deleteMessage(vars.id),
    onSuccess: (_data, variables) => {
      if (variables && variables.chat) {
        queryClient.invalidateQueries({
          queryKey: ["messages", "chat", variables.chat],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", "all"] });
    },
  });
};

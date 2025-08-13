import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentService } from "../services";
import type { Comment, CreateCommentData } from "../types/api";

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  byJournal: (journalId: string) =>
    [...commentKeys.all, "journal", journalId] as const,
  byId: (id: string) => [...commentKeys.all, "id", id] as const,
};

// Get comments by journal entry
export const useCommentsByJournal = (journalEntryId: string) => {
  return useQuery({
    queryKey: commentKeys.byJournal(journalEntryId),
    queryFn: () => commentService.getCommentsByJournalEntry(journalEntryId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!journalEntryId,
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentService.createComment(data),
    onSuccess: (newComment) => {
      // Update the comments list for the journal
      queryClient.setQueryData(
        commentKeys.byJournal(newComment.journalEntry),
        (oldComments: Comment[] | undefined) => {
          if (!oldComments) return [newComment];
          return [newComment, ...oldComments]; // Add new comment at the beginning
        }
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: commentKeys.byJournal(newComment.journalEntry),
      });
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
    },
  });
};

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (_, deletedCommentId) => {
      // Remove comment from all journal comment lists
      queryClient.setQueriesData(
        { queryKey: commentKeys.all },
        (oldComments: Comment[] | undefined) => {
          if (!oldComments) return oldComments;
          return oldComments.filter(
            (comment) => comment._id !== deletedCommentId
          );
        }
      );

      // Invalidate all comment queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
    },
  });
};

// Toggle comment like mutation
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.toggleCommentLike(commentId),
    onSuccess: (updatedComment) => {
      // Update with server response
      queryClient.setQueryData(
        commentKeys.byJournal(updatedComment.journalEntry),
        (oldComments: Comment[] | undefined) => {
          if (!oldComments) return [updatedComment];

          return oldComments.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          );
        }
      );

      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: commentKeys.byJournal(updatedComment.journalEntry),
      });
    },
    onError: (error) => {
      console.error("Failed to toggle comment like:", error);
    },
  });
};

// Upload comment images mutation
export const useUploadCommentImages = () => {
  return useMutation({
    mutationFn: ({ commentId, files }: { commentId: string; files: File[] }) =>
      commentService.uploadCommentImages(commentId, files),
    onError: (error) => {
      console.error("Failed to upload comment images:", error);
    },
  });
};

// Custom hook for comment stats (like count, user's like status)
export const useCommentStats = (comment: Comment, userId?: string) => {
  const likeCount = comment.likes.length;
  const isLikedByUser = userId ? comment.likes.includes(userId) : false;
  const isOwnComment = userId ? comment.author._id === userId : false;

  return {
    likeCount,
    isLikedByUser,
    isOwnComment,
  };
};

// Custom hook for comment form state
export const useCommentForm = (initialValue: string = "") => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setContent("");
    setIsSubmitting(false);
  };

  const validate = () => {
    return content.trim().length > 0 && content.length <= 500;
  };

  return {
    content,
    setContent,
    isSubmitting,
    setIsSubmitting,
    reset,
    validate,
    isValid: validate(),
  };
};

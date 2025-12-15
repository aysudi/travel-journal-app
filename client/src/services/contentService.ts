import { apiConfig } from "./apiConfig";
import type {
  Destination,
  CreateDestinationData,
  JournalEntry,
  CreateJournalEntryData,
  PaginatedResponse,
  PaginationParams,
  ListInvitation,
  CreateListInvitationData,
  Comment,
  CreateCommentData,
} from "../types/api";

export class DestinationService {
  private readonly endpoint = "/destinations";

  async getDestinations(
    travelListId?: string,
    params?: { search?: string; sort?: string; status?: string }
  ): Promise<Destination[]> {
    if (travelListId) {
      const response = await apiConfig.request<Destination[]>(
        `/destinations/travel-list/${travelListId}`
      );
      return response;
    }

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.status) searchParams.append("status", params.status);

    const query = searchParams.toString();
    const url = query ? `${this.endpoint}?${query}` : this.endpoint;

    return apiConfig.request<Destination[]>(url);
  }

  async getDestinationById(id: string): Promise<Destination> {
    return apiConfig.request<Destination>(`${this.endpoint}/${id}`);
  }

  async createDestination(
    data: CreateDestinationData | FormData
  ): Promise<Destination> {
    let body: BodyInit;
    let headers: Record<string, string> = {};
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }
    return apiConfig.request<Destination>(this.endpoint, {
      method: "POST",
      body,
      headers,
    });
  }

  async updateDestination(
    id: string,
    data: Partial<CreateDestinationData> | FormData
  ): Promise<Destination> {
    let body: BodyInit;
    let headers: Record<string, string> = {};
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }
    return apiConfig.request<Destination>(`${this.endpoint}/${id}`, {
      method: "PUT",
      body,
      headers,
    });
  }

  async deleteDestination(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  // Removed uploadDestinationImages; handled in create/update

  async removeDestinationImage(
    destinationId: string,
    imageUrl: string
  ): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/${destinationId}/images`,
      {
        method: "DELETE",
        body: JSON.stringify({ imageUrl }),
      }
    );
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    return apiConfig.request<Destination[]>(
      `${this.endpoint}/search?q=${encodeURIComponent(query)}`
    );
  }
}

export class JournalEntryService {
  private readonly endpoint = "/journal-entries";

  async toggleJournalEntryLike(entryId: string): Promise<JournalEntry> {
    return apiConfig.request<JournalEntry>(`${this.endpoint}/${entryId}/like`, {
      method: "PATCH",
    });
  }

  async getJournalEntries(
    params?: PaginationParams & {
      destinationId?: string;
      travelListId?: string;
      authorId?: string;
    }
  ) {
    const searchParams = new URLSearchParams();

    if (params?.destinationId)
      searchParams.append("destination", params.destinationId);
    if (params?.travelListId)
      searchParams.append("travelListId", params.travelListId);
    if (params?.authorId) searchParams.append("author", params.authorId);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    const query = searchParams.toString();
    const url = query ? `${this.endpoint}?${query}` : this.endpoint;

    return apiConfig.request<any>(url);
  }

  async getJournalEntryById(id: string): Promise<JournalEntry> {
    return apiConfig.request<JournalEntry>(`${this.endpoint}/${id}`);
  }

  async createJournalEntry(
    data: CreateJournalEntryData | FormData
  ): Promise<JournalEntry> {
    const isFormData = data instanceof FormData;
    return apiConfig.request<JournalEntry>(this.endpoint, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
    });
  }

  async updateJournalEntry(
    id: string,
    data: Partial<CreateJournalEntryData>
  ): Promise<JournalEntry> {
    return apiConfig.request<JournalEntry>(`${this.endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  async uploadJournalImages(
    entryId: string,
    files: File[]
  ): Promise<{ images: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return apiConfig.request<{ images: string[] }>(
      `${this.endpoint}/${entryId}/images`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiConfig.getToken()}`,
        },
      }
    );
  }

  async getPublicEntries(
    params?: PaginationParams
  ): Promise<PaginatedResponse<JournalEntry>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    const query = searchParams.toString();
    const url = query
      ? `${this.endpoint}/public?${query}`
      : `${this.endpoint}/public`;

    return apiConfig.request<PaginatedResponse<JournalEntry>>(url);
  }
}

export class ListInvitationService {
  private readonly endpoint = "/list-invitations";

  async getAllInvitations(): Promise<ListInvitation[]> {
    const response = await apiConfig.request<ListInvitation[]>(this.endpoint);
    return response || [];
  }

  // Get invitation by ID
  async getInvitationById(id: string): Promise<ListInvitation> {
    const response = await apiConfig.request<ListInvitation>(
      `${this.endpoint}/${id}`
    );
    return response;
  }

  // Create new invitation
  async createInvitation(
    invitationData: CreateListInvitationData
  ): Promise<ListInvitation> {
    const response = await apiConfig.request<ListInvitation>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(invitationData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  // Get invitations for a specific invitee (received invitations)
  async getInvitationsByInvitee(
    inviteeId: string,
    status?: string
  ): Promise<ListInvitation[]> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append("status", status);

    const query = searchParams.toString();
    const url = query
      ? `${this.endpoint}/invitee/${inviteeId}?${query}`
      : `${this.endpoint}/invitee/${inviteeId}`;

    const response = await apiConfig.request<ListInvitation[]>(url);

    return response || [];
  }

  // Get invitations sent by a specific inviter (sent invitations)
  async getInvitationsByInviter(
    inviterId: string,
    status?: string
  ): Promise<ListInvitation[]> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append("status", status);

    const query = searchParams.toString();
    const url = query
      ? `${this.endpoint}/inviter/${inviterId}?${query}`
      : `${this.endpoint}/inviter/${inviterId}`;

    const response = await apiConfig.request<ListInvitation[]>(url);
    return response || [];
  }

  // Accept invitation
  async acceptInvitation(invitationId: string): Promise<ListInvitation> {
    const response = await apiConfig.request<ListInvitation>(
      `${this.endpoint}/${invitationId}/accept`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  // Reject invitation
  async rejectInvitation(invitationId: string): Promise<ListInvitation> {
    const response = await apiConfig.request<ListInvitation>(
      `${this.endpoint}/${invitationId}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  // Cancel invitation (for inviters)
  async cancelInvitation(invitationId: string): Promise<{ message: string }> {
    const response = await apiConfig.request<{ message: string }>(
      `${this.endpoint}/${invitationId}/cancel`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }
}

export class CommentService {
  private readonly endpoint = "/comments";

  // Get comments by journal entry ID
  async getCommentsByJournalEntry(journalEntryId: string): Promise<Comment[]> {
    const response = await apiConfig.request<Comment[]>(
      `${this.endpoint}/journal/${journalEntryId}`
    );
    return response;
  }

  // Create a new comment
  async createComment(data: CreateCommentData | FormData): Promise<Comment> {
    const isFormData = data instanceof FormData;
    return apiConfig.request<Comment>(this.endpoint, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
    });
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/${commentId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Toggle like/unlike on a comment
  async toggleCommentLike(commentId: string): Promise<Comment> {
    return apiConfig.request<Comment>(`${this.endpoint}/${commentId}/like`, {
      method: "PATCH",
    });
  }

  // Upload photos for comments (if needed)
  async uploadCommentImages(
    commentId: string,
    files: File[]
  ): Promise<{ images: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return apiConfig.request<{ images: string[] }>(
      `${this.endpoint}/${commentId}/images`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiConfig.getToken()}`,
        },
      }
    );
  }
}

export const destinationService = new DestinationService();
export const journalEntryService = new JournalEntryService();
export const listInvitationService = new ListInvitationService();
export const commentService = new CommentService();

import { apiConfig } from "./apiConfig";
import type {
  Destination,
  CreateDestinationData,
  JournalEntry,
  CreateJournalEntryData,
  PaginatedResponse,
  PaginationParams,
} from "../types/api";

export class DestinationService {
  private readonly endpoint = "/destinations";

  async getDestinations(
    travelListId?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Destination>> {
    const searchParams = new URLSearchParams();

    if (travelListId) searchParams.append("travelListId", travelListId);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    const query = searchParams.toString();
    const url = query ? `${this.endpoint}?${query}` : this.endpoint;

    return apiConfig.request<PaginatedResponse<Destination>>(url);
  }

  async getDestinationById(id: string): Promise<Destination> {
    return apiConfig.request<Destination>(`${this.endpoint}/${id}`);
  }

  async createDestination(data: CreateDestinationData): Promise<Destination> {
    return apiConfig.request<Destination>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDestination(
    id: string,
    data: Partial<CreateDestinationData>
  ): Promise<Destination> {
    return apiConfig.request<Destination>(`${this.endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDestination(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  async uploadDestinationImages(
    destinationId: string,
    files: File[]
  ): Promise<{ images: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`images`, file);
    });

    return apiConfig.request<{ images: string[] }>(
      `${this.endpoint}/${destinationId}/images`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiConfig.getToken()}`,
        },
      }
    );
  }

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

  async getJournalEntries(
    params?: PaginationParams & {
      destinationId?: string;
      travelListId?: string;
      authorId?: string;
    }
  ): Promise<PaginatedResponse<JournalEntry>> {
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

    return apiConfig.request<PaginatedResponse<JournalEntry>>(url);
  }

  async getJournalEntryById(id: string): Promise<JournalEntry> {
    return apiConfig.request<JournalEntry>(`${this.endpoint}/${id}`);
  }

  async createJournalEntry(
    data: CreateJournalEntryData
  ): Promise<JournalEntry> {
    return apiConfig.request<JournalEntry>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
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

export const destinationService = new DestinationService();
export const journalEntryService = new JournalEntryService();
